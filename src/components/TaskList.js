import IconTimer from "/src/assets/icon/timer_white.png";
import IconPlay from "/src/assets/icon/play_black.png";
import IconStop from "/src/assets/icon/stop_black.png";
import IconClose from "/src/assets/icon/close_black.png";

export class TaskList {
  constructor(todoTitle, tasks, timer, updateTodoItem) {
    this.todoTitle = todoTitle;
    this.tasks = tasks;
    this.timer = timer;
    this.updateTodoItem = updateTodoItem;

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
    document.getElementById("task-input-view").style.display = "none";
    this.updatePomodoroStatus(this.tasks);

    const taskListElement = document.getElementById("task-list");
    taskListElement.innerHTML = "";

    this.tasks.forEach((task, taskIdx) => {
      const taskItem = document.createElement("div");
      taskListElement.appendChild(taskItem);
      taskItem.id = `task-${task.id}`;
      taskItem.className = "task-item";
      if (task.completed) taskItem.setAttribute("completed", "true");
      // else taskItem.removeAttribute("completed");

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

        if (this.timer.activeItem && this.timer.activeItem.id === task.id) {
          this.timer.stop();
          this.clearHeaderTimerRender();
          this.clearTaskTimerRender(task);
        }
        this.render();
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
      imgEl.src = IconTimer;
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
        const countDownTimerEl = document.createElement("div");
        taskItemRight.appendChild(countDownTimerEl);
        countDownTimerEl.className = "countdown-timer";
        if (this.timer.activeItem && this.timer.activeItem.id === task.id) {
          countDownTimerEl.style.display = "block";
          countDownTimerEl.classList.add("timer");
          countDownTimerEl.textContent = this.timer.el.textContent;
        } else countDownTimerEl.style.display = "none";

        const playBtnEl = document.createElement("button");
        taskItemRight.appendChild(playBtnEl);
        playBtnEl.innerHTML = `<img src=${IconPlay}>`;
        playBtnEl.className = "btn-img play-btn";
        playBtnEl.onclick = async () => {
          if (this.timer.is()) {
            alert("이미 실행 중인 할일이 있습니다.");
            return;
          }

          /* 타이머 시간 설정 */
          this.timer.setRemainingTime(task.pomodoroTime);

          /* 실행 중인 Task 활성화 */
          this.timer.setActiveItem(task);

          /* Task 타이머 렌더링  */
          this.startTaskTimerRender(task);

          /* Header 타이머 렌더링 */
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
              this.clearTaskTimerRender(task);

              /* 실행 중인 Task 비활성화 */
              this.timer.setActiveItem(null);
            },
            () => {
              this.timer.restart(() => {
                ++task.pomodoroCount;
                this.clearHeaderTimerRender();
                this.clearTaskTimerRender(task);
                this.render();
              });

              const pauseBtn = document.getElementById("header-pause-button");
              const playBtn = document.getElementById("header-play-button");

              pauseBtn.style.display = "block";
              playBtn.style.display = "none";
            },
          );

          /* 타이머 시작 */
          this.timer.start(() => {
            ++task.pomodoroCount;
            this.clearHeaderTimerRender();
            this.clearTaskTimerRender(task);
            this.render();
          });
        };

        const stopBtnEl = document.createElement("button");
        taskItemRight.appendChild(stopBtnEl);
        stopBtnEl.innerHTML = `<img src=${IconStop}>`;
        stopBtnEl.className = "btn-img stop-btn";
        stopBtnEl.style.display = "none";
        stopBtnEl.onclick = () => {
          this.timer.stop();
          this.clearHeaderTimerRender();
          this.clearTaskTimerRender(task);
        };
      }

      const deleteBtnEl = document.createElement("button");
      taskItemRight.appendChild(deleteBtnEl);
      deleteBtnEl.innerHTML = `<img src=${IconClose}>`;
      deleteBtnEl.className = "btn-img delete-btn";
      deleteBtnEl.onclick = () => {
        if (this.timer.activeItem && this.timer.activeItem.id === task.id) {
          this.timer.stop();
          this.clearHeaderTimerRender();
          this.clearTaskTimerRender(task);
        }
        this.tasks.splice(taskIdx, 1);
        this.updateTodoItem();
        this.render();
      };
    });
  }

  startTaskTimerRender(task) {
    const taskCountDownTimerEl = document
      .getElementById(`task-${task.id}`)
      .querySelector(".countdown-timer");
    const taskPlayBtnEl = document.getElementById(`task-${task.id}`).querySelector(".play-btn");
    const taskStopBtnEl = document.getElementById(`task-${task.id}`).querySelector(".stop-btn");

    taskCountDownTimerEl.style.display = "block";
    taskCountDownTimerEl.classList.add("timer");
    taskStopBtnEl.style.display = "block";
    taskPlayBtnEl.style.display = "none";
  }

  startHeaderTimerRender(task, onPause, onStop, onRestart) {
    const headerTitle = document.getElementById("header-title");
    const headerTimer = document.getElementById("header-timer");
    const todoTitle = document.getElementById("header-todo-title");
    const taskTitle = document.getElementById("header-task-title");
    const remainTime = document.getElementById("header-remaining-time");
    const pauseBtn = document.getElementById("header-pause-button");
    const stopBtn = document.getElementById("header-stop-button");
    const replayBtn = document.getElementById("header-play-button");

    headerTitle.style.display = "none";
    todoTitle.textContent = this.todoTitle;
    taskTitle.textContent = task.name;

    headerTimer.style.display = "block";

    remainTime.style.display = "block";
    remainTime.className = "timer";

    stopBtn.style.display = "block";
    stopBtn.onclick = onStop;

    pauseBtn.style.display = "block";
    pauseBtn.onclick = onPause;

    replayBtn.style.display = "none";
    replayBtn.onclick = onRestart;
  }

  clearHeaderTimerRender() {
    const headerTitle = document.getElementById("header-title");
    const headerTimer = document.getElementById("header-timer");
    const remainTime = document.getElementById("header-remaining-time");
    remainTime.classList.remove("timer");

    headerTitle.style.display = "block";
    headerTimer.style.display = "none";
  }

  clearTaskTimerRender(task) {
    const playBtnEl = document.getElementById(`task-${task.id}`).querySelector(".play-btn");
    const stopBtnEl = document.getElementById(`task-${task.id}`).querySelector(".stop-btn");
    const countDownTimerEl = document
      .getElementById(`task-${task.id}`)
      .querySelector(".countdown-timer");

    if (playBtnEl) playBtnEl.style.display = "block";
    if (stopBtnEl) stopBtnEl.style.display = "none";
    if (countDownTimerEl) {
      countDownTimerEl.style.display = "none";
      countDownTimerEl.classList.remove("timer");
    }
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

    const DEFAULT_INPUT_VALUE = "새로운 할 일 입력";

    pomodoroInput.onchange = (e) => {
      if (e.target.value > 60) pomodoroInput.value = 60;
      if (e.target.value < 1) pomodoroInput.value = 1;
    };

    // 초기화
    taskInput.value = editTask ? editTask.task.name : "새로운 할 일 입력";
    pomodoroInput.value = editTask ? editTask.task.pomodoroTime : 25;

    // 입력 뷰 보여주기
    taskInputView.style.display = "block";
    taskInput.onfocus = () => {
      if (taskInput.value === DEFAULT_INPUT_VALUE) taskInput.value = "";
    };

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
      this.updateTodoItem();

      this.render();
    };

    const cancelBtn = document.getElementById("cancel-task-button");
    cancelBtn.onclick = () => {
      taskInputView.style.display = "none"; // 입력창 닫기
    };
  }
}