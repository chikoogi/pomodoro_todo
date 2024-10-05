// import { getMMSSFormat } from "../services/tools.js";
//
// let ACTIVE_TIMER = null;
//
// export function renderTaskDetails(item, setItems) {
//   const todoItem = item;
//
//   const title = todoItem.name;
//   updateTaskTitle(title);
//
//   let tasks = todoItem.tasks;
//   const setTasks = (updateTasks) => {
//     tasks = updateTasks;
//     setItems(tasks);
//     updateTaskList(tasks, setTasks);
//     updatePomodoroStatus(tasks);
//   };
//   updateTaskList(tasks, setTasks);
//
//   document.getElementById("add-task-button").onclick = () => {
//     const taskInputView = document.getElementById("task-input-view");
//     if (taskInputView.style.display === "none") {
//       showTaskInputView(tasks, setTasks);
//     }
//   };
// }
//
// function showTaskInputView(tasks, setTasks, editTask = null) {
//   const taskInputView = document.getElementById("task-input-view");
//   const taskInput = document.getElementById("task-input");
//   const pomodoroInput = document.getElementById("pomodoro-input");
//   pomodoroInput.onchange = (e) => {
//     if (e.target.value > 60) pomodoroInput.value = 60;
//     if (e.target.value < 1) pomodoroInput.value = 1;
//   };
//
//   // 초기화
//   taskInput.value = editTask ? editTask.name : "새로운 할 일 입력";
//   pomodoroInput.value = editTask ? editTask.pomodoroTime : 25;
//
//   taskInputView.style.display = "block";
//   taskInput.focus();
//
//   const saveBtn = document.getElementById("save-task-button");
//   saveBtn.onclick = () => {
//     const taskName = taskInput.value.trim();
//     const pomodoroTime = pomodoroInput.value.trim();
//
//     if (!taskName || !pomodoroTime) return;
//
//     if (editTask) {
//       // 수정 모드일 때
//       const findIndex = tasks.findIndex((v) => v.id === editTask.id);
//       tasks.splice(findIndex, 1, {
//         ...editTask,
//         name: taskName,
//         pomodoroTime: parseInt(pomodoroTime),
//       });
//       setTasks([...tasks]);
//     } else {
//       // 새 할 일 추가 모드일 때
//       const newTask = {
//         id: Date.now().toString(),
//         name: taskName,
//         pomodoroTime: parseInt(pomodoroTime),
//         pomodoroCount: 0,
//         completed: false,
//       };
//       setTasks([...tasks, newTask]);
//     }
//
//     taskInputView.style.display = "none"; // 입력창 닫기
//   };
//
//   const cancelBtn = document.getElementById("cancel-task-button");
//   cancelBtn.onclick = () => {
//     taskInputView.style.display = "none"; // 입력창 닫기
//   };
// }
//
// function updateTaskTitle(title) {
//   const taskTitleElement = document.getElementById("task-list-title");
//   taskTitleElement.textContent = title;
// }
//
// function getTaskTitle() {
//   return document.getElementById("task-list-title").textContent;
// }
//
// function updatePomodoroStatus(tasks) {
//   const pomodoroTotalElement = document.getElementById("pomodoro-total");
//   pomodoroTotalElement.innerHTML = tasks.length;
//
//   const pomodoroCurrentElement = document.getElementById("pomodoro-current");
//   pomodoroCurrentElement.innerHTML = tasks.filter((task) => task.completed).length;
// }
//
// function updateTaskList(tasks, setTasks) {
//   const taskListElement = document.getElementById("task-list");
//   taskListElement.innerHTML = "";
//
//   tasks.forEach((task, taskIndex) => {
//     const taskItem = document.createElement("div");
//     taskListElement.appendChild(taskItem);
//     taskItem.id = `task-${task.id}`;
//     taskItem.className = "task-item";
//     if (task.completed) taskItem.classList.add("completed");
//     else taskItem.classList.remove("completed");
//
//     const taskItemLeft = document.createElement("div");
//     taskItem.appendChild(taskItemLeft);
//     taskItemLeft.className = "task-item-left";
//
//     const checkboxEl = document.createElement("input");
//     taskItemLeft.appendChild(checkboxEl);
//     checkboxEl.type = "checkbox";
//     checkboxEl.checked = task.completed;
//     checkboxEl.onchange = (e) => {
//       tasks.splice(taskIndex, 1, {
//         ...task,
//         completed: e.target.checked,
//       });
//       setTasks(tasks);
//     };
//
//     const textEl = document.createElement("div");
//     taskItemLeft.appendChild(textEl);
//     textEl.className = "task-text-wrapper";
//     textEl.onclick = () => {
//       showTaskInputView(tasks, setTasks, task);
//     };
//
//     const nameEl = document.createElement("span");
//     nameEl.innerText = task.name;
//
//     const timeEl = document.createElement("span");
//     timeEl.className = "task-pomodoro-time";
//     timeEl.innerText = `(${task.pomodoroTime}m)`;
//
//     const imgEl = document.createElement("img");
//     imgEl.src = "src/assets/icon/timer10.png";
//     imgEl.width = 20;
//     imgEl.height = 20;
//
//     const countEl = document.createElement("span");
//     countEl.className = "task-pomodoro-count";
//     countEl.innerText = task.pomodoroCount;
//
//     textEl.append(nameEl, timeEl, imgEl, countEl);
//
//     const taskItemRight = document.createElement("div");
//     taskItem.appendChild(taskItemRight);
//     taskItemRight.className = "task-item-right";
//
//     if (!task.completed) {
//       const countDownTimerEl = document.createElement("span");
//       taskItemRight.appendChild(countDownTimerEl);
//       countDownTimerEl.className = "countdown-timer";
//       countDownTimerEl.style.display = "none";
//
//       const playBtnEl = document.createElement("button");
//       taskItemRight.appendChild(playBtnEl);
//       playBtnEl.innerHTML = `&gt;`;
//       playBtnEl.className = "play-btn";
//       playBtnEl.onclick = () => {
//         startTimer(task, () => {
//           tasks.splice(taskIndex, 1, {
//             ...task,
//             pomodoroCount: ++task.pomodoroCount,
//           });
//           setTasks([...tasks]);
//         });
//       };
//
//       const stopBtnEl = document.createElement("button");
//       taskItemRight.appendChild(stopBtnEl);
//       stopBtnEl.innerHTML = `ㅁ`;
//       stopBtnEl.className = "stop-btn";
//       stopBtnEl.style.display = "none";
//       stopBtnEl.onclick = () => {
//         stopTimer(task);
//       };
//     }
//
//     const deleteBtnEl = document.createElement("button");
//     taskItemRight.appendChild(deleteBtnEl);
//     deleteBtnEl.innerHTML = `X`;
//     deleteBtnEl.onclick = () => {
//       stopTimer(task);
//       tasks.splice(taskIndex, 1); // 해당
//       setTasks(tasks);
//     };
//   });
// }
//
// /* 참고 https://www.w3schools.com/howto/howto_js_countdown.asp */
// function startTimer(task, onIncreaseCount, restart = false) {
//   if (restart) {
//     if (ACTIVE_TIMER) {
//       ACTIVE_TIMER = {
//         task,
//         intervalTimer: null,
//         remainingTime: ACTIVE_TIMER.remainingTime,
//       };
//     }
//   } else {
//     if (ACTIVE_TIMER) {
//       alert("이미 실행 중");
//       return;
//     } else {
//       ACTIVE_TIMER = {
//         task,
//         intervalTimer: null,
//         remainingTime: task.pomodoroTime * 60,
//       };
//     }
//   }
//
//   const taskEl = document.getElementById("task-list").querySelector(`#task-${task.id}`);
//   const taskPlayBtnEl = taskEl.querySelector(".play-btn");
//   const taskStopBtnEl = taskEl.querySelector(".stop-btn");
//   const taskCountDownTimerEl = taskEl.querySelector(".countdown-timer");
//   const headerPauseBtn = document.getElementById("header-pause-button");
//   const headerPlayBtn = document.getElementById("header-play-button");
//
//   taskPlayBtnEl.style.display = "none";
//   taskStopBtnEl.style.display = "block";
//   taskCountDownTimerEl.style.display = "inline-block";
//   headerPauseBtn.style.display = "block";
//   headerPlayBtn.style.display = "none";
//
//   taskCountDownTimerEl.textContent = getMMSSFormat(ACTIVE_TIMER.remainingTime);
//   updateHeader(task, ACTIVE_TIMER.remainingTime, onIncreaseCount);
//
//   const intervalTimer = setInterval(() => {
//     if (ACTIVE_TIMER.remainingTime <= 0) {
//       clearInterval(intervalTimer);
//       onIncreaseCount();
//       ACTIVE_TIMER = null;
//       updateHeader(null, 0);
//       return;
//     }
//
//     ACTIVE_TIMER.remainingTime--;
//     taskCountDownTimerEl.textContent = getMMSSFormat(ACTIVE_TIMER.remainingTime);
//     updateHeader(task, ACTIVE_TIMER.remainingTime, onIncreaseCount);
//   }, 500);
//   ACTIVE_TIMER.intervalTimer = intervalTimer;
//
//   return intervalTimer;
// }
//
// function stopTimer(task) {
//   const taskEl = document.getElementById("task-list").querySelector(`#task-${task.id}`);
//
//   const playBtnEl = taskEl.querySelector(".play-btn");
//   const stopBtnEl = taskEl.querySelector(".stop-btn");
//   const countDownTimerEl = taskEl.querySelector(".countdown-timer");
//
//   if (playBtnEl) playBtnEl.style.display = "block";
//   if (stopBtnEl) stopBtnEl.style.display = "none";
//   if (countDownTimerEl) countDownTimerEl.style.display = "none";
//
//   if (ACTIVE_TIMER && ACTIVE_TIMER.task === task) {
//     clearInterval(ACTIVE_TIMER.intervalTimer);
//     clearHeaderTimer(); // 헤더 초기화
//     ACTIVE_TIMER = null; // 타이머 정보 초기화
//   }
// }
//
// function pauseTimer(task) {
//   if (ACTIVE_TIMER && ACTIVE_TIMER.task === task) {
//     const pauseBtn = document.getElementById("header-pause-button");
//     const playBtn = document.getElementById("header-play-button");
//
//     pauseBtn.style.display = "none";
//     playBtn.style.display = "block";
//     clearInterval(ACTIVE_TIMER.intervalTimer); // 타이머 일시정지
//     console.log("남은 시간:", ACTIVE_TIMER.remainingTime);
//   }
// }
//
// function updateHeader(task, pomodoroTime, onIncreaseCount) {
//   const headerTitle = document.getElementById("header-title");
//
//   const headerTimer = document.getElementById("header-timer");
//   const taskTitle = document.getElementById("header-task-title");
//   const remainTime = document.getElementById("header-remaining-time");
//   const pauseBtn = document.getElementById("header-pause-button");
//   const stopBtn = document.getElementById("header-stop-button");
//   const playBtn = document.getElementById("header-play-button");
//
//   headerTitle.style.display = "none";
//   headerTimer.style.display = "block";
//   taskTitle.textContent = `${getTaskTitle()} / ${task.name}`;
//   remainTime.textContent = getMMSSFormat(pomodoroTime);
//
//   stopBtn.onclick = () => stopTimer(task);
//   pauseBtn.onclick = () => pauseTimer(task);
//   playBtn.onclick = () => startTimer(task, onIncreaseCount, true);
// }
//
// function clearHeaderTimer() {
//   const headerTitle = document.getElementById("header-title");
//   const headerTimer = document.getElementById("header-timer");
//   headerTitle.style.display = "block";
//   headerTimer.style.display = "none";
// }
