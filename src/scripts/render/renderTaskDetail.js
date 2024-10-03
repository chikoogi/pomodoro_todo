export function renderTaskDetails(item) {
  const todoItem = item;

  const title = todoItem.name;
  let tasks = todoItem.tasks;

  const setTasks = (updateTasks) => {
    tasks = updateTasks;
    updateTaskList(tasks, setTasks);
  };

  updateTaskTitle(title);
  updateTaskList(tasks, setTasks);

  document.getElementById("add-task-button").addEventListener("click", () => {
    const taskInputView = document.getElementById("task-input-view");
    if (taskInputView.style.display === "none") {
      showTaskInputView(tasks, setTasks);
    }
  });
}

function showTaskInputView(tasks, setTasks, editTask = null) {
  const taskInputView = document.getElementById("task-input-view");
  const taskInput = document.getElementById("task-input");
  const pomodoroInput = document.getElementById("pomodoro-input");

  // 초기화
  taskInput.value = editTask ? editTask.name : "새로운 할 일 입력";
  pomodoroInput.value = editTask ? editTask.pomodoro : 25;

  taskInputView.style.display = "block";
  taskInput.focus();

  document.getElementById("save-task-button").addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    const pomodoroTime = pomodoroInput.value.trim();

    if (taskName && pomodoroTime) {
      if (editTask) {
        // 수정 모드일 때
        editTask.name = taskName;
        editTask.pomodoro = parseInt(pomodoroTime);
      } else {
        // 새 할 일 추가 모드일 때
        const newTask = {
          name: taskName,
          pomodoro: parseInt(pomodoroTime),
          completed: false,
        };
        tasks.push(newTask);
      }

      setTasks(tasks); // 상태 업데이트 및 저장
      taskInputView.style.display = "none"; // 입력창 닫기
    }
  });

  document.getElementById("cancel-task-button").addEventListener("click", () => {
    taskInputView.style.display = "none"; // 입력창 닫기
  });
}

function updateTaskTitle(title) {
  const taskTitleElement = document.getElementById("task-list-title");
  taskTitleElement.textContent = title;
}

function updateTaskList(tasks, setTasks) {
  const taskListElement = document.getElementById("task-list");
  taskListElement.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskListElement.appendChild(taskItem);

    taskItem.innerHTML = `
    <div class="task-item">
      <div class="task-item-left">
        <span>${task.text}</span>
        <span>(${task.pomodoroTime})분</span>
        <span><img src="src/assets/icon/timer10.png" width="20px"/>${task.pomodoroCount}</span>
      </div>
      <div class="task-item-right">
        <button> &gt; </button>
        <button> X </button>
      </div>
      
    </div>
    `;
  });
}

function deleteTask(tasks, taskIndex) {
  tasks.splice(taskIndex, 1); // 해당 인덱스의 할 일 삭제
  renderTaskDetails(tasks); // 할 일 목록 갱신
}
