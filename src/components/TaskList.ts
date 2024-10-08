import IconTimer from "/static/images/timer_white.png";
import IconPlay from "/static/images/play_black.png";
import IconStop from "/static/images/stop_black.png";
import IconClose from "/static/images/close_black.png";
import { TaskItem } from "../interfaces/common-interface";
import { Timer } from "./Timer";

export class TaskList {
  private todoTitle: string;
  private tasks: TaskItem[];
  private timer: Timer;
  private updateTodoItem: () => void;
  constructor(todoTitle: string, tasks: TaskItem[], timer: Timer, updateTodoItem: () => void) {
    this.todoTitle = todoTitle;
    this.tasks = tasks;
    this.timer = timer;
    this.updateTodoItem = updateTodoItem;
  }

  clear() {
    const rightPanelWrapper = document.getElementById("right-panel-wrapper") as HTMLDivElement;
    rightPanelWrapper.style.display = "none";

    this.updateTaskTitle("");

    const taskListElement = document.getElementById("task-list") as HTMLDivElement;
    taskListElement.innerHTML = "";
  }

  init() {
    const rightPanelWrapper = document.getElementById("right-panel-wrapper") as HTMLDivElement;
    rightPanelWrapper.style.display = "block";

    const addTaskBtn = document.getElementById("add-task-button") as HTMLButtonElement;
    addTaskBtn.onclick = () => {
      this.showTaskInputView();
    };

    this.render();
  }

  render() {
    const taskInputView = document.getElementById("task-input-view") as HTMLDivElement;
    taskInputView.style.display = "none";
    this.updateTaskTitle(this.todoTitle);
    this.updateTaskStatus();

    const taskListElement = document.getElementById("task-list") as HTMLDivElement;
    taskListElement.innerHTML = "";

    this.tasks.forEach((task) => {
      this.renderTaskItem(task);
    });
  }

  renderTaskItem(task: TaskItem, target: HTMLElement | null = null) {
    const taskListElement = document.getElementById("task-list") as HTMLDivElement;

    let taskItemEl;
    if (target) {
      taskItemEl = target; // 기존 요소 업데이트
      taskItemEl.innerHTML = "";
    } else {
      taskItemEl = document.createElement("div");
      taskListElement.appendChild(taskItemEl); // 새 요소 추가
    }

    taskItemEl.id = `task-${task.id}`;
    taskItemEl.className = "task-item";
    if (task.completed) taskItemEl.setAttribute("completed", "true");
    else taskItemEl.setAttribute("completed", "false");

    /* 할일 좌측 영역 */
    const taskItemLeft = document.createElement("div");
    taskItemEl.appendChild(taskItemLeft);
    taskItemLeft.className = "task-item-left";

    /* 완료/미완료 체크박스 */
    const checkboxEl = document.createElement("input");
    taskItemLeft.appendChild(checkboxEl);
    checkboxEl.type = "checkbox";
    checkboxEl.className = "checkbox";
    checkboxEl.checked = task.completed;
    checkboxEl.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const editTask = {
        ...task,
        completed: target.checked,
      };
      this.updateTaskItem(editTask);

      if (this.timer.activeItem && this.timer.activeItem.id === task.id) {
        this.timer.stop();
        this.clearHeaderTimerRender();
        this.clearTaskTimerRender(task);
      }
    };

    /* 할일 텍스트 영역 */
    const textWrapperEl = document.createElement("div");
    taskItemLeft.appendChild(textWrapperEl);
    textWrapperEl.className = "task-text-wrapper";
    textWrapperEl.onclick = () => {
      if (!task.completed) this.showTaskInputView(task);
    };

    const nameEl = document.createElement("span");
    nameEl.textContent = task.name;
    nameEl.className = "task-name";

    const timeEl = document.createElement("span");
    timeEl.className = "task-pomodoro-time";
    timeEl.textContent = `(${task.pomodoroTime}m)`;

    const imgEl = document.createElement("img");
    imgEl.src = `${IconTimer}`;
    imgEl.width = 20;
    imgEl.height = 20;

    const countEl = document.createElement("span");
    countEl.className = "task-pomodoro-count";
    countEl.textContent = task.pomodoroCount.toString();

    textWrapperEl.append(nameEl, timeEl, imgEl, countEl);

    /* 할일 우측 영역*/
    const taskItemRight = document.createElement("div");
    taskItemEl.appendChild(taskItemRight);
    taskItemRight.className = "task-item-right";

    /* 미완료된 할일 렌더링 */
    if (!task.completed) {
      /* 할일 타이머 시간 출력 */
      const countDownTimerEl = document.createElement("div");
      taskItemRight.appendChild(countDownTimerEl);
      countDownTimerEl.className = "countdown-timer";
      countDownTimerEl.style.display = "none";

      /* 할일 타이머 시작 버튼 */
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
          /* Header 일시 정지 이벤트 */
          () => {
            this.timer.pause();

            const pauseBtn = document.getElementById("header-pause-button") as HTMLButtonElement;
            const playBtn = document.getElementById("header-play-button") as HTMLButtonElement;

            pauseBtn.style.display = "none";
            playBtn.style.display = "block";
          },
          /* Header 정지 이벤트 */
          () => {
            this.timer.stop();
            this.clearHeaderTimerRender();
            this.clearTaskTimerRender(task);
          },
          /* Header 재시작 이벤트 */
          () => {
            this.timer.restart(() => {
              const editTask = {
                ...task,
                pomodoroCount: ++task.pomodoroCount,
              };
              this.updateTaskItem(editTask);
              this.clearHeaderTimerRender();
              this.clearTaskTimerRender(task);
            });

            const pauseBtn = document.getElementById("header-pause-button") as HTMLButtonElement;
            const playBtn = document.getElementById("header-play-button") as HTMLButtonElement;

            pauseBtn.style.display = "block";
            playBtn.style.display = "none";
          },
        );

        /* 타이머 시작 */
        this.timer.start(() => {
          const editTask = {
            ...task,
            pomodoroCount: ++task.pomodoroCount,
          };
          this.updateTaskItem(editTask);
          this.clearHeaderTimerRender();
          this.clearTaskTimerRender(task);
        });
      };

      /* 할일 타이머 정지 버튼 */
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

    /* 타이머 실행 여부에 따라 타이머 시간 조건부 렌더링 */
    this.checkTaskTimerRender(task);

    /* 할일 삭제 버튼 */
    const deleteBtnEl = document.createElement("button");
    taskItemRight.appendChild(deleteBtnEl);
    deleteBtnEl.innerHTML = `<img src=${IconClose}>`;
    deleteBtnEl.className = "btn-img delete-btn";
    deleteBtnEl.onclick = (e) => {
      e.stopPropagation();
      this.deleteTaskItem(task);
    };
  }

  addTaskItem(task) {
    this.tasks.splice(this.tasks.length, 0, task);

    this.renderTaskItem(task);
    this.updateTaskStatus();
    this.updateTodoItem();
  }

  deleteTaskItem(task) {
    const taskIdx = this.tasks.findIndex((v) => v.id === task.id);
    if (taskIdx === -1) return;
    this.tasks.splice(taskIdx, 1);

    if (this.timer.activeItem && this.timer.activeItem.id === task.id) {
      this.timer.stop();
      this.clearHeaderTimerRender();
      this.clearTaskTimerRender(task);
    }

    const taskListEl = document.getElementById("task-list") as HTMLDivElement;
    if (taskListEl.children[taskIdx]) {
      taskListEl.children[taskIdx].remove();
    }
    this.updateTaskStatus();
    this.updateTodoItem();
  }

  updateTaskItem(task) {
    const taskIdx = this.tasks.findIndex((v) => v.id === task.id);
    this.tasks.splice(taskIdx, 1, task);

    if (document.getElementById(`task-${task.id}`)) {
      this.renderTaskItem(task, document.getElementById(`task-${task.id}`));
      this.updateTaskStatus();
    }
    this.updateTodoItem();
  }

  /* 할일 아이템 렌더링마다 확인 */
  checkTaskTimerRender(task) {
    const taskEl = document.getElementById(`task-${task.id}`);
    if (!taskEl) return;
    const taskCountDownTimerEl = taskEl.querySelector(".countdown-timer") as HTMLDivElement;
    const taskPlayBtnEl = taskEl.querySelector(".play-btn") as HTMLButtonElement;
    const taskStopBtnEl = taskEl.querySelector(".stop-btn") as HTMLButtonElement;
    if (this.timer.activeItem && this.timer.activeItem.id === task.id) {
      if (taskCountDownTimerEl) {
        taskCountDownTimerEl.style.display = "block";
        taskCountDownTimerEl.classList.add("timer");
        taskCountDownTimerEl.textContent = this.timer.el.textContent;
      }

      if (taskPlayBtnEl) taskPlayBtnEl.style.display = "none";
      if (taskStopBtnEl) taskStopBtnEl.style.display = "block";
    } else {
      if (taskCountDownTimerEl) {
        taskCountDownTimerEl.style.display = "none";
        taskCountDownTimerEl.classList.remove("timer");
      }
      if (taskPlayBtnEl) taskPlayBtnEl.style.display = "block";
      if (taskStopBtnEl) taskStopBtnEl.style.display = "none";
    }
  }

  /* timer start 실행시 할일 렌더링 변경 */
  startTaskTimerRender(task) {
    const taskEl = document.getElementById(`task-${task.id}`);
    if (!taskEl) return;
    const taskCountDownTimerEl = taskEl.querySelector(".countdown-timer") as HTMLDivElement;
    const taskPlayBtnEl = taskEl.querySelector(".play-btn") as HTMLButtonElement;
    const taskStopBtnEl = taskEl.querySelector(".stop-btn") as HTMLButtonElement;

    if (taskCountDownTimerEl) {
      taskCountDownTimerEl.style.display = "block";
      taskCountDownTimerEl.classList.add("timer");
    }
    if (taskPlayBtnEl) taskPlayBtnEl.style.display = "none";
    if (taskStopBtnEl) taskStopBtnEl.style.display = "block";
  }

  clearTaskTimerRender(task) {
    const taskEl = document.getElementById(`task-${task.id}`);
    if (!taskEl) return;
    const taskCountDownTimerEl = taskEl.querySelector(".countdown-timer") as HTMLDivElement;
    const taskPlayBtnEl = taskEl.querySelector(".play-btn") as HTMLButtonElement;
    const taskStopBtnEl = taskEl.querySelector(".stop-btn") as HTMLButtonElement;

    if (taskCountDownTimerEl) {
      taskCountDownTimerEl.style.display = "none";
      taskCountDownTimerEl.classList.remove("timer");
    }
    if (taskPlayBtnEl) taskPlayBtnEl.style.display = "block";
    if (taskStopBtnEl) taskStopBtnEl.style.display = "none";
  }

  /* timer start 실행시 헤더 렌더링 변경 */
  startHeaderTimerRender(
    task: TaskItem,
    onPause: () => void,
    onStop: () => void,
    onRestart: () => void,
  ) {
    const headerTitle = document.getElementById("header-title") as HTMLDivElement;
    const headerTimer = document.getElementById("header-timer") as HTMLDivElement;
    const todoTitle = document.getElementById("header-todo-title") as HTMLDivElement;
    const taskTitle = document.getElementById("header-task-title") as HTMLDivElement;
    const remainTime = document.getElementById("header-remaining-time") as HTMLDivElement;
    const pauseBtn = document.getElementById("header-pause-button") as HTMLButtonElement;
    const stopBtn = document.getElementById("header-stop-button") as HTMLButtonElement;
    const replayBtn = document.getElementById("header-play-button") as HTMLButtonElement;

    headerTitle.style.display = "none";
    todoTitle.textContent = this.todoTitle;
    taskTitle.textContent = task.name;

    headerTimer.style.display = "block";

    remainTime.style.display = "block";
    remainTime.classList.add("timer");

    stopBtn.style.display = "block";
    stopBtn.onclick = onStop;

    pauseBtn.style.display = "block";
    pauseBtn.onclick = onPause;

    replayBtn.style.display = "none";
    replayBtn.onclick = onRestart;
  }

  clearHeaderTimerRender() {
    const headerTitle = document.getElementById("header-title") as HTMLDivElement;
    const headerTimer = document.getElementById("header-timer") as HTMLDivElement;
    const remainTime = document.getElementById("header-remaining-time") as HTMLDivElement;
    remainTime.classList.remove("timer");

    headerTitle.style.display = "block";
    headerTimer.style.display = "none";
  }

  updateTaskTitle(title) {
    const taskTitleElement = document.getElementById("task-list-title") as HTMLDivElement;
    taskTitleElement.textContent = title;
  }

  updateTaskStatus() {
    const taskTotalCount = document.getElementById("task-total-count") as HTMLDivElement;
    taskTotalCount.textContent = this.tasks.length.toString();

    const taskCompleteCount = document.getElementById("task-complete-count") as HTMLDivElement;
    taskCompleteCount.textContent = this.tasks.filter((task) => task.completed).length.toString();
  }

  showTaskInputView(editTask?: TaskItem) {
    const taskInputView = document.getElementById("task-input-view") as HTMLDivElement;
    const taskInput = document.getElementById("task-input") as HTMLInputElement;
    const pomodoroInput = document.getElementById("pomodoro-input") as HTMLInputElement;

    pomodoroInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (+target.value > 60) pomodoroInput.value = "60";
      if (+target.value < 1) pomodoroInput.value = "1";
    };

    // 초기화
    taskInput.value = editTask ? editTask.name : "새로운 할 일 입력";
    pomodoroInput.value = editTask ? editTask.pomodoroTime.toString() : "25";

    // 입력 뷰 보여주기
    taskInputView.style.display = "block";
    taskInput.onfocus = () => {
      if (!editTask) taskInput.value = "";
    };

    const saveBtn = document.getElementById("save-task-button") as HTMLButtonElement;
    saveBtn.onclick = () => {
      const taskName = taskInput.value.trim();
      const pomodoroTime = pomodoroInput.value.trim();

      if (!taskName || !pomodoroTime) return; // 유효성 검사

      if (editTask) {
        /*수정*/
        const updateTask = {
          ...editTask,
          name: taskName,
          pomodoroTime: parseInt(pomodoroTime),
        };
        this.updateTaskItem(updateTask);
      } else {
        /*추가*/
        const newTask = {
          id: Date.now().toString(),
          name: taskName,
          pomodoroTime: parseInt(pomodoroTime),
          pomodoroCount: 0,
          completed: false,
        };
        this.addTaskItem(newTask);
      }
      taskInputView.style.display = "none";
    };

    const cancelBtn = document.getElementById("cancel-task-button") as HTMLButtonElement;
    cancelBtn.onclick = () => {
      taskInputView.style.display = "none";
    };
  }
}
