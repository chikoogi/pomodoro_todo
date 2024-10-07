import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { TODO_LIST } from "../src/tools/data.js";
import fs from "node:fs";
import path from "node:path";
import { TodoList } from "../src/components/TodoList.js";

/*  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
  expect(alertMock).toHaveBeenCalled();
  alertMock.mockRestore();

* */

describe("TaskList", () => {
  let todoList,
    mockTodoLists,
    html,
    mockLength = TODO_LIST.length,
    taskList,
    selectedItem;

  beforeEach(() => {
    html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    document.body.innerHTML = html;

    mockTodoLists = [...TODO_LIST];
    todoList = new TodoList(mockTodoLists);

    todoList.init();

    let folderItems = document.querySelectorAll(".folder-item");
    folderItems[0].onclick();
  });

  test("Task 타이틀이 출력되는지 확인", () => {
    const rightPanelEl = document.getElementById("right-panel-wrapper");
    expect(rightPanelEl.style.display).toBe("block");

    let folderItems = document.querySelectorAll(".folder-item");
    folderItems[0].onclick();

    expect(document.getElementById("task-list-title").textContent).toBe(todoList.selectedItem.name);

    folderItems[1].onclick();
    expect(rightPanelEl.style.display).toBe("block");
    expect(document.getElementById("task-list-title").textContent).toBe(todoList.selectedItem.name);
  });

  test("Task 목록이 렌더링 되는지 확인", () => {});

  test("할일 추가", () => {});
  test("할일 삭제", () => {});
  test("할일 수정", () => {});
  test("할일 완료 상태 변경", () => {});
});
