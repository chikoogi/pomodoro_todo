import { TodoList } from "../src/components/TodoList.ts";
import { beforeEach, describe, test, expect, jest } from "@jest/globals";
import { TODO_LIST } from "../src/tools/data.js";
import * as fs from "node:fs";
import * as path from "node:path";

describe("TodoList 테스트", () => {
  let todoList, mockTodoLists, html, selectedIdx;

  beforeEach(() => {
    html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    document.body.innerHTML = html;

    mockTodoLists = [...TODO_LIST];
    todoList = new TodoList([...TODO_LIST]);

    todoList.init();
  });

  test("Todo 전체 목록이 렌더링되고 이름과 할일 갯수를 출력하는지 확인", () => {
    const folderItems = document.querySelectorAll(".folder-item");

    expect(folderItems.length).toBe(mockTodoLists.length);
    folderItems.forEach((item, idx) => {
      expect(item.textContent).toContain(mockTodoLists[idx].name);
      expect(item.textContent).toContain(mockTodoLists[idx].tasks.length.toString());
    });
  });

  test("Todo 항목을 추가하고 마지막에 추가 되었는지 확인", () => {
    const ADD_TITLE = "테스트 제목";

    const folderInputView = document.getElementById("folder-input-view");

    const addBtn = document.getElementById("add-folder-button");
    addBtn.click();

    /*추가 버튼 클릭 후 입력창 표시 여부 확인*/
    expect(folderInputView.style.display).toBe("block");

    let folderInput = document.getElementById("folder-input");
    folderInput.value = ADD_TITLE;

    const enter = new KeyboardEvent("keydown", { key: "Enter" });
    folderInput.dispatchEvent(enter);

    const folderItems = document.querySelectorAll(".folder-item");

    /* 저장 후 추가 확인 */
    expect(todoList.todoLists.length).toBe(mockTodoLists.length + 1);
    expect(todoList.todoLists[todoList.todoLists.length - 1].name).toBe(ADD_TITLE);
    expect(todoList.todoLists[todoList.todoLists.length - 1].tasks.length).toBe(0);

    /* 저장 후 렌더링 확인 */
    expect(folderItems.length).toBe(mockTodoLists.length + 1);
    expect(folderItems[folderItems.length - 1].textContent).toContain(folderInput.value);
    expect(folderItems[folderItems.length - 1].textContent).toContain("0");

    /* 저장 후 입력창 표시 여부 확인*/
    expect(folderInputView.style.display).toBe("none");
  });

  test("Todo 항목 삭제 버튼 클릭 후 - confirm(확인)일때 삭제가 되는지 확인", () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    let folderItems = document.querySelectorAll(".folder-item");
    const deleteBtn = folderItems[0].querySelector("button");
    deleteBtn.click();

    folderItems = document.querySelectorAll(".folder-item");
    expect(todoList.todoLists.length).toBe(mockTodoLists.length - 1);
    expect(folderItems.length).toBe(mockTodoLists.length - 1);
  });

  test("Todo 항목 삭제 버큰 클릭 후 - confirm(취소)일때 삭제가 취소 되는지 확인", () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(false);

    let folderItems = document.querySelectorAll(".folder-item");

    const deleteBtn = folderItems[0].querySelector("button");
    deleteBtn.click();

    folderItems = document.querySelectorAll(".folder-item");

    expect(todoList.todoLists.length).toBe(mockTodoLists.length);
    expect(folderItems.length).toBe(mockTodoLists.length);
  });

  test("Todo 항목을 클릭 했을때 선택이 되는지 확인", () => {
    let folderItems = document.querySelectorAll(".folder-item");

    folderItems[0].onclick();
    expect(todoList.selectedItem.name).toBe(mockTodoLists[0].name);
    expect(todoList.selectedItem.tasks.length).toBe(mockTodoLists[0].tasks.length);
    expect(folderItems[0].classList.contains("selected")).toBe(true);

    folderItems[1].onclick();
    expect(todoList.selectedItem.name).toBe(mockTodoLists[1].name);
    expect(todoList.selectedItem.tasks.length).toBe(mockTodoLists[1].tasks.length);
    expect(folderItems[1].classList.contains("selected")).toBe(true);
  });

  test("Todo의 할일 갯수가 변경 되었을때 변경된 항목이 업데이트 되는지 확인", () => {
    const prevTodoCount = todoList.todoLists.length;
    const prevTaskCount = todoList.todoLists[0].tasks.length;

    const updateItem = {
      ...mockTodoLists[0],
      tasks: [
        ...mockTodoLists[0].tasks,
        {
          id: "444",
          name: "추가",
          pomodoroTime: 15,
          pomodoroCount: 0,
          completed: false,
        },
      ],
    };

    todoList.updateTodoItem(updateItem);
    expect(todoList.todoLists.length).toBe(prevTodoCount);
    expect(todoList.todoLists[0].tasks.length).toBe(prevTaskCount + 1);

    const todoItem = document.getElementById(`todo-${todoList.todoLists[0].id}`);
    expect(todoItem.querySelector(".todo-task-count").textContent).toBe(
      (prevTaskCount + 1).toString(),
    );
  });
});
