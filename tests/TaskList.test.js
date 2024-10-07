import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { TODO_LIST } from "../src/tools/data.js";
import fs from "node:fs";
import path from "node:path";
import { Timer } from "../src/components/Timer.js";
import { TaskList } from "../src/components/TaskList.js";
import { getMMSSFormat } from "../src/tools/tools.js";

/*  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
  expect(alertMock).toHaveBeenCalled();
  alertMock.mockRestore();

* */

describe("TaskList", () => {
  let taskList, mockTasks, mockTitle, html, timer, selectedTodoIdx, selectedIdx;
  const updateTodoItem = jest.fn();

  beforeEach(() => {
    html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    document.body.innerHTML = html;

    selectedTodoIdx = 0;
    selectedIdx = 0;
    mockTitle = TODO_LIST[selectedTodoIdx].name;
    mockTasks = [...TODO_LIST[selectedTodoIdx].tasks];
    timer = new Timer();
    taskList = new TaskList(
      TODO_LIST[selectedTodoIdx].name,
      [...TODO_LIST[selectedTodoIdx].tasks],
      timer,
      updateTodoItem,
    );

    taskList.init();
  });

  test("Task 타이틀이 출력", () => {
    const rightPanelEl = document.getElementById("right-panel-wrapper");
    expect(rightPanelEl.style.display).toBe("block");
    expect(document.getElementById("task-list-title").textContent).toBe(mockTitle);
  });

  test("Task 목록이 렌더링", () => {
    const taskItems = document.querySelectorAll(".task-item");
    expect(taskItems.length).toBe(mockTasks.length);
    taskItems.forEach((taskItem, index) => {
      expect(taskItem.querySelector(".checkbox").checked).toBe(mockTasks[index].completed);
      expect(taskItem.querySelector(".task-name").textContent).toContain(mockTasks[index].name);
      expect(taskItem.querySelector(".task-pomodoro-time").textContent).toContain(
        mockTasks[index].pomodoroTime.toString(),
      );
      expect(taskItem.querySelector(".task-pomodoro-count").textContent).toContain(
        mockTasks[index].pomodoroCount.toString(),
      );
    });
  });

  test("할일 추가", () => {
    const tasksTotalCount = taskList.tasks.length;

    const addTaskBtn = document.getElementById("add-task-button");
    addTaskBtn.click();

    // 입력 필드 값 설정 및 엔터 키 이벤트 발생
    let taskInput = document.getElementById("task-input");
    taskInput.value = "테스크 할일 입력";

    const pomodoroInput = document.getElementById("pomodoro-input");
    pomodoroInput.value = 30;

    const saveBtn = document.getElementById("save-task-button");
    saveBtn.click();

    /* 상단 총 갯수 렌더링 */
    expect(document.getElementById("pomodoro-total").textContent).toBe(
      (tasksTotalCount + 1).toString(),
    );

    /* 할 일 목록 확인*/
    const taskItems = document.querySelectorAll(".task-item");
    expect(taskItems.length).toBe(tasksTotalCount + 1);
    expect(taskItems[taskItems.length - 1].querySelector(".checkbox").checked).toBe(false);
    expect(taskItems[taskItems.length - 1].querySelector(".task-name").textContent).toBe(
      taskInput.value,
    );
    expect(
      taskItems[taskItems.length - 1].querySelector(".task-pomodoro-time").textContent,
    ).toContain(pomodoroInput.value.toString());
    expect(
      taskItems[taskItems.length - 1].querySelector(".task-pomodoro-count").textContent,
    ).toContain("0");

    expect(taskList.tasks.length).toBe(tasksTotalCount + 1);
    expect(taskList.tasks[taskList.tasks.length - 1].completed).toBe(false);
    expect(taskList.tasks[taskList.tasks.length - 1].name).toBe(taskInput.value);
    expect(taskList.tasks[taskList.tasks.length - 1].pomodoroTime).toBe(+pomodoroInput.value);
    expect(taskList.tasks[taskList.tasks.length - 1].pomodoroCount).toBe(0);
  });

  test("할일 수정", () => {
    const taskItems = document.querySelectorAll(".task-item");
    let taskItem = document.querySelectorAll(".task-item")[selectedIdx];
    const taskTextWrapper = taskItem.querySelector(".task-text-wrapper");
    taskTextWrapper.click();

    /* taskItem 텍스트 선택 */
    let taskInput = document.getElementById("task-input");
    expect(taskInput.value).toBe(mockTasks[selectedIdx].name);

    const pomodoroInput = document.getElementById("pomodoro-input");
    expect(pomodoroInput.value).toContain(mockTasks[selectedIdx].pomodoroTime.toString());

    taskInput.value = "수정";
    pomodoroInput.value = 1;

    const saveBtn = document.getElementById("save-task-button");
    saveBtn.click();

    // 할 일 목록 확인
    taskItem = document.querySelectorAll(".task-item")[selectedIdx];
    expect(taskItems.length).toBe(mockTasks.length);
    expect(taskItem.querySelector(".checkbox").checked).toBe(
      taskItem.querySelector(".checkbox").checked,
    );
    expect(taskItem.querySelector(".task-name").textContent).toBe(taskInput.value);
    expect(taskItem.querySelector(".task-pomodoro-time").textContent).toContain(
      pomodoroInput.value.toString(),
    );
    expect(taskItem.querySelector(".task-pomodoro-count").textContent).toContain(
      taskItem.querySelector(".task-pomodoro-count").textContent,
    );

    expect(taskList.tasks[selectedIdx].completed).toBe(taskList.tasks[selectedIdx].completed);
    expect(taskList.tasks[selectedIdx].name).toBe(taskInput.value);
    expect(taskList.tasks[selectedIdx].pomodoroTime).toBe(+pomodoroInput.value);
    expect(taskList.tasks[selectedIdx].pomodoroCount).toBe(
      taskList.tasks[selectedIdx].pomodoroCount,
    );
  });

  test("할일 삭제", () => {
    const selectedIdx = 0;
    let taskItems = document.querySelectorAll(".task-item");
    const deleteBtn = taskItems[selectedIdx].querySelector(".delete-btn");
    deleteBtn.click(); // 첫 번째 항목 삭제

    taskItems = document.querySelectorAll(".task-item");
    expect(taskItems.length).toBe(mockTasks.length - 1); // 항목이 삭제되었는지 확인
  });

  test("할일 완료 상태 변경", () => {
    const tasksCompletedCount = taskList.tasks.filter((v) => v.completed).length;

    const taskItems = document.querySelectorAll(".task-item");
    const checkbox = taskItems[selectedIdx].querySelector("input[type='checkbox']");

    checkbox.checked = !taskList.tasks[selectedIdx].completed;
    const changeEvent = new Event("change");
    checkbox.dispatchEvent(changeEvent); // 체크박스 상태 변경 이벤트 발생

    expect(taskList.tasks[selectedIdx].completed).toBe(checkbox.checked);

    /* 상단 할일 완료 갯수 렌더링 */
    expect(document.getElementById("pomodoro-current").textContent).toBe(
      (tasksCompletedCount + 1).toString(),
    );
  });

  test("타이머 시작 및 종료", () => {
    jest.useFakeTimers();

    const taskItems = document.querySelectorAll(".task-item");
    const playBtn = taskItems[selectedIdx].querySelector(".play-btn");
    playBtn.click();

    const pomodoroTime = taskList.tasks[selectedIdx].pomodoroTime * 60;
    const pomodoroCount = taskList.tasks[selectedIdx].pomodoroCount;

    /* pomodoro 진행*/
    jest.advanceTimersByTime(pomodoroTime * 1000);
    // 타이머 카운트다운 표시가 업데이트되었는지 확인
    expect(
      document.querySelectorAll(".task-item")[0].querySelector(".countdown-timer").textContent,
    ).toBe("00:00");

    jest.advanceTimersByTime(1000);
    expect(
      document.querySelectorAll(".task-item")[0].querySelector(".countdown-timer").style.display,
    ).toBe("none");
    expect(
      document.querySelectorAll(".task-item")[0].querySelector(".task-pomodoro-count").textContent,
    ).toBe((pomodoroCount + 1).toString());
    expect(taskList.tasks[selectedIdx].pomodoroCount).toBe(pomodoroCount + 1);
  });

  test("타이머 진행 중 다른 할일 클릭시", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    const taskItems = document.querySelectorAll(".task-item");
    const playBtn = taskItems[selectedIdx].querySelector(".play-btn");
    playBtn.click();

    const playBtn2 = taskItems[selectedIdx + 1].querySelector(".play-btn");
    playBtn2.click();

    expect(alertMock).toHaveBeenCalled();
    expect(timer.activeItem.id).toBe(taskList.tasks[selectedIdx].id);
    alertMock.mockRestore();
  });

  test("타이머 시작 및 정지", () => {
    jest.useFakeTimers();

    const taskItems = document.querySelectorAll(".task-item");
    const playBtn = taskItems[selectedIdx].querySelector(".play-btn");
    playBtn.click();

    const pomodoroTime = taskList.tasks[selectedIdx].pomodoroTime * 60;
    const pomodoroCount = taskList.tasks[selectedIdx].pomodoroCount;

    /* pomodoro 진행*/
    jest.advanceTimersByTime(pomodoroTime * 1000 * 0.5);
    expect(taskItems[0].querySelector(".countdown-timer").textContent).toBe(
      getMMSSFormat(pomodoroTime * 0.5),
    );

    // 타이머 중지
    const stopBtn = taskItems[0].querySelector(".stop-btn");
    stopBtn.click();

    expect(
      document.querySelectorAll(".task-item")[0].querySelector(".countdown-timer").style.display,
    ).toBe("none");
    expect(
      document.querySelectorAll(".task-item")[0].querySelector(".task-pomodoro-count").textContent,
    ).toBe(pomodoroCount.toString());
    expect(taskList.tasks[selectedIdx].pomodoroCount).toBe(pomodoroCount);
  });

  test("헤더 타이머 일시정지 및 재시작", () => {
    jest.useFakeTimers();

    const taskItems = document.querySelectorAll(".task-item");
    const playBtn = taskItems[selectedIdx].querySelector(".play-btn");
    playBtn.click();

    expect(document.getElementById("header-title").style.display).toBe("none");
    expect(document.getElementById("header-timer").style.display).toBe("block");

    expect(document.getElementById("header-todo-title").textContent).toBe(taskList.todoTitle);
    expect(document.getElementById("header-task-title").textContent).toBe(
      taskList.tasks[selectedIdx].name,
    );

    const pomodoroTime = taskList.tasks[selectedIdx].pomodoroTime * 60;
    const pomodoroCount = taskList.tasks[selectedIdx].pomodoroCount;

    jest.advanceTimersByTime(pomodoroTime * 1000 * 0.5);
    expect(document.getElementById("header-remaining-time").textContent).toBe(
      getMMSSFormat(pomodoroTime * 0.5),
    );

    const pauseBtn = document.getElementById("header-pause-button");
    pauseBtn.click();

    jest.advanceTimersByTime(pomodoroTime * 1000 * 0.5);
    expect(document.getElementById("header-remaining-time").textContent).toBe(
      getMMSSFormat(pomodoroTime * 0.5),
    );

    const replayBtn = document.getElementById("header-play-button");
    replayBtn.click();

    jest.advanceTimersByTime(pomodoroTime * 1000 * 0.5);
    expect(document.getElementById("header-remaining-time").textContent).toBe("00:00");

    jest.advanceTimersByTime(1000);
    expect(document.getElementById("header-title").style.display).toBe("block");
    expect(document.getElementById("header-timer").style.display).toBe("none");
    expect(
      document.querySelectorAll(".task-item")[selectedIdx].querySelector(".task-pomodoro-count")
        .textContent,
    ).toBe((pomodoroCount + 1).toString());
    expect(taskList.tasks[selectedIdx].pomodoroCount).toBe(pomodoroCount + 1);
  });

  test("헤더 타이머 시작 및 정지", () => {
    jest.useFakeTimers();

    const taskItems = document.querySelectorAll(".task-item");
    const playBtn = taskItems[selectedIdx].querySelector(".play-btn");
    playBtn.click();

    expect(document.getElementById("header-title").style.display).toBe("none");
    expect(document.getElementById("header-timer").style.display).toBe("block");

    expect(document.getElementById("header-todo-title").textContent).toBe(taskList.todoTitle);
    expect(document.getElementById("header-task-title").textContent).toBe(
      taskList.tasks[selectedIdx].name,
    );

    const pomodoroTime = taskList.tasks[selectedIdx].pomodoroTime * 60;
    const pomodoroCount = taskList.tasks[selectedIdx].pomodoroCount;

    jest.advanceTimersByTime(pomodoroTime * 1000 * 0.5);
    expect(document.getElementById("header-remaining-time").textContent).toBe(
      getMMSSFormat(pomodoroTime * 0.5),
    );

    const stopBtn = document.getElementById("header-stop-button");
    stopBtn.click();

    expect(document.getElementById("header-title").style.display).toBe("block");
    expect(document.getElementById("header-timer").style.display).toBe("none");

    expect(
      document.querySelectorAll(".task-item")[selectedIdx].querySelector(".task-pomodoro-count")
        .textContent,
    ).toBe(pomodoroCount.toString());
    expect(taskList.tasks[selectedIdx].pomodoroCount).toBe(pomodoroCount);
  });
});
