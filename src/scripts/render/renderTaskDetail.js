export function renderTaskDetails(item, setItems) {
  const todoItem = item;

  const title = todoItem.name;
  let tasks = todoItem.tasks;

  const setTasks = (updateTasks) => {
    tasks = updateTasks;
    setItems(tasks);
    updateTaskList(tasks, setTasks);
    updatePomodoroStatus(tasks);
  };

  updateTaskTitle(title);
  updateTaskList(tasks, setTasks);

  document.getElementById("add-task-button").onclick = () => {
    const taskInputView = document.getElementById("task-input-view");
    if (taskInputView.style.display === "none") {
      showTaskInputView(tasks, setTasks);
    }
  };
}

function showTaskInputView(tasks, setTasks, editTask = null) {
  const taskInputView = document.getElementById("task-input-view");
  const taskInput = document.getElementById("task-input");
  const pomodoroInput = document.getElementById("pomodoro-input");

  // 초기화
  taskInput.value = editTask ? editTask.name : "새로운 할 일 입력";
  pomodoroInput.value = editTask ? editTask.pomodoroTime : 25;

  taskInputView.style.display = "block";
  taskInput.focus();

  const saveBtn = document.getElementById("save-task-button");
  saveBtn.onclick = () => {
    const taskName = taskInput.value.trim();
    const pomodoroTime = pomodoroInput.value.trim();

    if (!taskName || !pomodoroTime) return;

    if (editTask) {
      // 수정 모드일 때
      editTask.name = taskName;
      editTask.pomodoroTime = parseInt(pomodoroTime);
    } else {
      // 새 할 일 추가 모드일 때
      const newTask = {
        name: taskName,
        pomodoroTime: parseInt(pomodoroTime),
        pomodoroCount: 0,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    taskInputView.style.display = "none"; // 입력창 닫기
  };

  document.getElementById("cancel-task-button").click = () => {
    taskInputView.style.display = "none"; // 입력창 닫기
  };
}

function updateTaskTitle(title) {
  const taskTitleElement = document.getElementById("task-list-title");
  taskTitleElement.textContent = title;
}

function updatePomodoroStatus(tasks) {
  const pomodoroTotalElement = document.getElementById("pomodoro-total");
  pomodoroTotalElement.innerHTML = tasks.length;

  const pomodoroCurrentElement = document.getElementById("pomodoro-current");
  pomodoroCurrentElement.innerHTML = tasks.filter((task) => task.completed).length;
}

function updateTaskList(tasks, setTasks) {
  const taskListElement = document.getElementById("task-list");
  taskListElement.innerHTML = "";

  tasks.forEach((task, taskIndex) => {
    const taskItem = document.createElement("div");
    taskListElement.appendChild(taskItem);
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
      tasks.splice(taskIndex, 1, {
        ...task,
        completed: e.target.checked,
      });
      setTasks(tasks);
    };

    const textEl = document.createElement("div");
    taskItemLeft.appendChild(textEl);
    textEl.className = "task-text-wrapper";

    const nameEl = document.createElement("span");
    nameEl.innerText = task.name;

    const timeEl = document.createElement("span");
    timeEl.className = "task-pomodoro-item";
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

    const playBtnEl = document.createElement("button");
    taskItemRight.appendChild(playBtnEl);
    playBtnEl.innerHTML = `&gt;`;

    const deleteBtnEl = document.createElement("button");
    taskItemRight.appendChild(deleteBtnEl);
    deleteBtnEl.innerHTML = `X`;
    deleteBtnEl.onclick = () => {
      tasks.splice(taskIndex, 1); // 해당
      setTasks(tasks);
    };
  });
}
