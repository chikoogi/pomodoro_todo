import { TodoList } from "../src/components/TodoList.ts";
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
    todoList = new TodoList([...TODO_LIST]);

    todoList.init();
  });

  test("Todo 목록이 렌더링", () => {
    const folderItems = document.querySelectorAll(".folder-item");

    expect(folderItems.length).toBe(mockTodoLists.length);
    expect(folderItems[0].textContent).toContain(mockTodoLists[0].name);
    expect(folderItems[0].textContent).toContain(mockTodoLists[0].tasks.length.toString());
    expect(folderItems[1].textContent).toContain(mockTodoLists[1].name);
    expect(folderItems[1].textContent).toContain(mockTodoLists[1].tasks.length.toString());
  });

  test("할일 추가됐을때 할 일 갯수", () => {});

  test("Todo 항목 추가 테스트", () => {
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
    expect(todoList.todoLists.length).toBe(mockTodoLists.length + 1);
    expect(todoList.todoLists[todoList.todoLists.length - 1].name).toBe(folderInput.value);
    expect(todoList.todoLists[todoList.todoLists.length - 1].tasks.length).toBe(0);

    expect(folderItems.length).toBe(mockTodoLists.length + 1);
    expect(folderItems[2].textContent).toContain(folderInput.value);
    expect(folderItems[2].textContent).toContain("0");

    /* 저장 후 입력창 표시 여부 확인*/
    expect(folderInputView.style.display).toBe("none");
  });

  test("Todo 항목 삭제 - confirm 확인", () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    let folderItems = document.querySelectorAll(".folder-item");
    const deleteBtn = folderItems[0].querySelector("button");
    deleteBtn.click();

    folderItems = document.querySelectorAll(".folder-item");
    expect(todoList.todoLists.length).toBe(mockTodoLists.length - 1);
    expect(folderItems.length).toBe(mockTodoLists.length - 1);
  });

  test("Todo 항목 삭제 - confirm 취소", () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(false);

    let folderItems = document.querySelectorAll(".folder-item");

    const deleteBtn = folderItems[0].querySelector("button");
    deleteBtn.click();

    folderItems = document.querySelectorAll(".folder-item");

    expect(todoList.todoLists.length).toBe(mockTodoLists.length);
    expect(folderItems.length).toBe(mockTodoLists.length);
  });

  test("Todo 항목 선택", () => {
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
});
