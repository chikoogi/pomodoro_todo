import { getMMSSFormat } from "../scripts/services/tools.js";

export class TaskList {
  constructor(todoTitle, tasks, timer) {
    this.todoTitle = todoTitle;
    this.tasks = tasks;
    this.timer = timer;

    document.getElementById("add-task-button").onclick = () => {
      const taskInputView = document.getElementById("task-input-view");
      if (taskInputView.style.display === "none") {
        this.showTaskInputView();
      }
    };
  }

  init() {
    this.updateTaskTitle(this.todoTitle);
    this.render();
  }

  render() {
    this.updatePomodoroStatus(this.tasks);

    const taskListElement = document.getElementById("task-list");
    taskListElement.innerHTML = "";

    this.tasks.forEach((task, taskIdx) => {
      const taskItem = document.createElement("div");
      taskListElement.appendChild(taskItem);
      taskItem.id = `task-${task.id}`;
      taskItem.className = "task-item";
      if (task.completed) taskItem.classList.add("completed");
      else taskItem.classList.remove("completed");

      const taskItemLeft = document.createElement("div");
      taskItem.appendChild(taskItemLeft);
      taskItemLeft.className = "task-item-left";

      const checkboxEl = document.createElement("input");
      taskItemLeft.appendChild(checkboxEl);
      checkboxEl.type = "checkbox";
      checkboxEl.checked = task.completed;
      checkboxEl.onchange = (e) => {
        this.tasks.splice(taskIdx, 1, {
          ...task,
          completed: e.target.checked,
        });
      };

      const textEl = document.createElement("div");
      taskItemLeft.appendChild(textEl);
      textEl.className = "task-text-wrapper";
      textEl.onclick = () => {
        this.showTaskInputView({ task, taskIdx });
      };

      const nameEl = document.createElement("span");
      nameEl.innerText = task.name;

      const timeEl = document.createElement("span");
      timeEl.className = "task-pomodoro-time";
      timeEl.innerText = `(${task.pomodoroTime}m)`;

      const imgEl = document.createElement("img");
      imgEl.src = "src/assets/icon/timer10.png";
      imgEl.width = 20;
      imgEl.height = 20;

      const countEl = document.createElement("span");
      countEl.className = "task-pomodoro-count";
      countEl.innerText = task.pomodoroCount;

      textEl.append(nameEl, timeEl, imgEl, countEl);

      const taskItemRight = document.createElement("div");
      taskItem.appendChild(taskItemRight);
      taskItemRight.className = "task-item-right";

      if (!task.completed) {
        const countDownTimerEl = document.createElement("span");
        taskItemRight.appendChild(countDownTimerEl);
        countDownTimerEl.className = "countdown-timer";
        countDownTimerEl.style.display = "none";

        const playBtnEl = document.createElement("button");
        taskItemRight.appendChild(playBtnEl);
        playBtnEl.innerHTML = `&gt;`;
        playBtnEl.className = "play-btn";
        playBtnEl.onclick = () => {
          if (this.timer.is()) {
            alert("이미 실행 중인 할일이 있습니다.");
            return;
          }

          /* 타이머 시간 설정 */
          /* 분단위 -> 초단위 변경*/
          this.timer.setRemainingTime(task.pomodoroTime);

          /* task 타이머 렌더링  */
          this.startTaskTimerRender(taskItemRight);

          /* 헤더 타이머 렌더링 */
          this.startHeaderTimerRender(
            task,
            () => {
              this.timer.pause();

              const pauseBtn = document.getElementById("header-pause-button");
              const playBtn = document.getElementById("header-play-button");

              pauseBtn.style.display = "none";
              playBtn.style.display = "block";
            },
            () => {
              this.timer.stop();
              this.clearHeaderTimerRender();
              this.clearTaskTimerRender(taskItemRight);

              /* 실행 중인 Task 비활성화 */
              this.timer.setActiveItem(null);
            },
            () => {
              this.timer.restart(
                (remainingTime) => {
                  const taskCountDownTimerEl = taskItemRight.querySelector(".countdown-timer");
                  const remainTime = document.getElementById("header-remaining-time");
                  taskCountDownTimerEl.textContent = getMMSSFormat(remainingTime);
                  remainTime.textContent = getMMSSFormat(remainingTime);
                },
                () => {
                  ++task.pomodoroCount;
                  this.clearHeaderTimerRender();
                  this.render();
                },
              );

              const pauseBtn = document.getElementById("header-pause-button");
              const playBtn = document.getElementById("header-play-button");

              pauseBtn.style.display = "block";
              playBtn.style.display = "none";
            },
          );

          /* 타이머 시작 */
          this.timer.start(
            (remainingTime) => {
              const taskCountDownTimerEl = taskItemRight.querySelector(".countdown-timer");
              const remainTime = document.getElementById("header-remaining-time");

              taskCountDownTimerEl.textContent = getMMSSFormat(remainingTime);
              remainTime.textContent = getMMSSFormat(remainingTime);
              console.log(taskCountDownTimerEl.textContent);
            },
            () => {
              ++task.pomodoroCount;
              this.clearHeaderTimerRender();
              this.render();
            },
          );

          /* 실행 중인 Task 활성화 */
          this.timer.setActiveItem(task);
        };

        const stopBtnEl = document.createElement("button");
        taskItemRight.appendChild(stopBtnEl);
        stopBtnEl.innerHTML = `ㅁ`;
        stopBtnEl.className = "stop-btn";
        stopBtnEl.style.display = "none";
        stopBtnEl.onclick = () => {
          this.timer.stop();
          this.clearHeaderTimerRender();
          this.clearTaskTimerRender(taskItemRight);

          /* 실행 중인 Task 비활성화 */
          this.timer.setActiveItem(null);
        };

        if (this.timer.activeItem && this.timer.activeItem.id === task.id) {
          console.log("true");
          this.startTaskTimerRender(taskItemRight);
        }
      }

      const deleteBtnEl = document.createElement("button");
      taskItemRight.appendChild(deleteBtnEl);
      deleteBtnEl.innerHTML = `X`;
      deleteBtnEl.onclick = () => {
        if (this.timer.is()) {
          this.timer.stop();
          this.clearHeaderTimerRender();
          this.clearTaskTimerRender(taskItemRight);
        }
        this.tasks.splice(taskIdx, 1);
        this.render();
      };
    });
  }

  startTaskTimerRender(taskEl) {
    const taskPlayBtnEl = taskEl.querySelector(".play-btn");
    const taskStopBtnEl = taskEl.querySelector(".stop-btn");
    const taskCountDownTimerEl = taskEl.querySelector(".countdown-timer");

    taskPlayBtnEl.style.display = "none";
    taskStopBtnEl.style.display = "block";
    taskCountDownTimerEl.style.display = "inline-block";

    console.log(taskCountDownTimerEl.textContent, "____");
  }

  startHeaderTimerRender(task, onPause, onStop, onRestart) {
    const headerTitle = document.getElementById("header-title");

    const headerTimer = document.getElementById("header-timer");
    const taskTitle = document.getElementById("header-task-title");
    const remainTime = document.getElementById("header-remaining-time");
    const pauseBtn = document.getElementById("header-pause-button");
    const stopBtn = document.getElementById("header-stop-button");
    const rePlayBtn = document.getElementById("header-play-button");

    headerTitle.style.display = "none";
    headerTimer.style.display = "block";
    stopBtn.style.display = "block";
    pauseBtn.style.display = "block";
    rePlayBtn.style.display = "none";

    taskTitle.textContent = `${this.todoTitle} / ${task.name}`;

    stopBtn.onclick = onStop;
    pauseBtn.onclick = onPause;
    rePlayBtn.onclick = onRestart;
  }

  clearHeaderTimerRender() {
    const headerTitle = document.getElementById("header-title");
    const headerTimer = document.getElementById("header-timer");
    headerTitle.style.display = "block";
    headerTimer.style.display = "none";
  }

  clearTaskTimerRender(taskEl) {
    const playBtnEl = taskEl.querySelector(".play-btn");
    const stopBtnEl = taskEl.querySelector(".stop-btn");
    const countDownTimerEl = taskEl.querySelector(".countdown-timer");

    if (playBtnEl) playBtnEl.style.display = "block";
    if (stopBtnEl) stopBtnEl.style.display = "none";
    if (countDownTimerEl) countDownTimerEl.style.display = "none";
  }

  updateTaskTitle(title) {
    const taskTitleElement = document.getElementById("task-list-title");
    taskTitleElement.textContent = title;
  }

  updatePomodoroStatus(tasks) {
    const pomodoroTotalElement = document.getElementById("pomodoro-total");
    pomodoroTotalElement.innerHTML = tasks.length;

    const pomodoroCurrentElement = document.getElementById("pomodoro-current");
    pomodoroCurrentElement.innerHTML = tasks.filter((task) => task.completed).length;
  }

  showTaskInputView(editTask) {
    const taskInputView = document.getElementById("task-input-view");
    const taskInput = document.getElementById("task-input");
    const pomodoroInput = document.getElementById("pomodoro-input");

    pomodoroInput.onchange = (e) => {
      if (e.target.value > 60) pomodoroInput.value = 60;
      if (e.target.value < 1) pomodoroInput.value = 1;
    };

    // 초기화
    taskInput.value = editTask ? editTask.task.name : "새로운 할 일 입력";
    pomodoroInput.value = editTask ? editTask.task.pomodoroTime : 25;

    // 입력 뷰 보여주기
    taskInputView.style.display = "block";
    taskInput.focus();

    const saveBtn = document.getElementById("save-task-button");
    saveBtn.onclick = () => {
      const taskName = taskInput.value.trim();
      const pomodoroTime = pomodoroInput.value.trim();

      if (!taskName || !pomodoroTime) return; // 유효성 검사

      if (editTask) {
        /*수정*/
        this.tasks.splice(editTask.taskIdx, 1, {
          ...editTask.task,
          name: taskName,
          pomodoroTime: parseInt(pomodoroTime),
        });
      } else {
        /*추가*/
        const newTask = {
          id: Date.now().toString(),
          name: taskName,
          pomodoroTime: parseInt(pomodoroTime),
          pomodoroCount: 0,
          completed: false,
        };
        this.tasks.push(newTask);
      }

      taskInputView.style.display = "none"; // 입력창 숨기기
      this.render();
    };

    const cancelBtn = document.getElementById("cancel-task-button");
    cancelBtn.onclick = () => {
      taskInputView.style.display = "none"; // 입력창 닫기
    };
  }
}
