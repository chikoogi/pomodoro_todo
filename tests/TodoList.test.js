import { TodoList } from "../src/components/TodoList.js";
import { beforeEach, describe, test, expect, jest } from "@jest/globals";
import { TODO_LIST } from "../src/tools/data.js";
import * as fs from "node:fs";
import * as path from "node:path";

describe("TodoList", () => {
  let todoList, mockTodoLists, html;

  beforeEach(() => {
    html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    document.body.innerHTML = html;

    mockTodoLists = [...TODO_LIST];
    todoList = new TodoList(mockTodoLists);

    todoList.init();
  });

  test("Todo 목록이 렌더링 되는지 확인", () => {
    const folderItems = document.querySelectorAll(".folder-item");

    expect(folderItems.length).toBe(TODO_LIST.length);
    expect(folderItems[0].textContent).toContain(TODO_LIST[0].name);
    expect(folderItems[0].textContent).toContain(TODO_LIST[0].tasks.length.toString());
    expect(folderItems[1].textContent).toContain(TODO_LIST[1].name);
    expect(folderItems[1].textContent).toContain(TODO_LIST[1].tasks.length.toString());
  });

  test("Todo 항목 추가 확인", () => {
    const folderInputView = document.getElementById("folder-input-view");

    const addBtn = document.getElementById("add-folder-button");
    addBtn.click();

    /*추가 버튼 클릭 후 입력창 표시 여부 확인*/
    expect(folderInputView.style.display).toBe("block");

    let folderInput = document.getElementById("folder-input");
    folderInput.value = "테스트 제목";

    const enter = new KeyboardEvent("keydown", { key: "Enter" });
    folderInput.dispatchEvent(enter);

    const folderItems = document.querySelectorAll(".folder-item");

    /* 저장 후 추가 확인*/
    expect(todoList.todoLists.length).toBe(TODO_LIST.length + 1);
    expect(todoList.todoLists.pop().name).toBe(folderInput.value);
    expect(todoList.todoLists.pop().tasks.length).toBe(0);

    expect(folderItems.length).toBe(TODO_LIST.length + 1);
    expect(folderItems[2].textContent).toContain(folderInput.value);
    expect(folderItems[2].textContent).toContain("0");

    /* 저장 후 입력창 표시 여부 확인*/
    expect(folderInputView.style.display).toBe("none");
  });

  test("Todo 항목 삭제 확인 - confirm 확인", () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    let folderItems = document.querySelectorAll(".folder-item");
    const deleteBtn = folderItems[0].querySelector("button");
    deleteBtn.click();

    folderItems = document.querySelectorAll(".folder-item");
    expect(todoList.todoLists.length).toBe(TODO_LIST.length - 1);
    expect(folderItems.length).toBe(TODO_LIST.length - 1);
  });

  test("Todo 항목 삭제 확인 - confirm 취소", () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(false);

    let folderItems = document.querySelectorAll(".folder-item");

    const deleteBtn = folderItems[0].querySelector("button");
    deleteBtn.click();

    folderItems = document.querySelectorAll(".folder-item");

    expect(todoList.todoLists.length).toBe(TODO_LIST.length);
    expect(folderItems.length).toBe(TODO_LIST.length);
  });

  test("Todo 항목 선택 확인", () => {
    let folderItems = document.querySelectorAll(".folder-item");
    folderItems[0].onclick();

    expect(todoList.selectedItem.name).toBe(TODO_LIST[0].name);
    expect(todoList.selectedItem.tasks.length).toBe(TODO_LIST[0].tasks.length);
    expect(folderItems[0].classList.contains("selected")).toBe(true);

    folderItems[1].onclick();
    expect(todoList.selectedItem.name).toBe(TODO_LIST[1].name);
    expect(todoList.selectedItem.tasks.length).toBe(TODO_LIST[1].tasks.length);
    expect(folderItems[1].classList.contains("selected")).toBe(true);
  });
});
