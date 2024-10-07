import { TodoList } from "../src/components/TodoList.js";
import { beforeEach, describe, test, expect, jest } from "@jest/globals";
import { TODO_LIST } from "../src/tools/data.js";
import * as fs from "node:fs";
import * as path from "node:path";

describe("TodoList", () => {
  let todoList, mockTodoLists;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    document.body.innerHTML = html;

    mockTodoLists = TODO_LIST;
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
    expect(folderItems.length).toBe(TODO_LIST.length);
    expect(folderItems[2].textContent).toContain(folderInput.value);
    expect(folderItems[2].textContent).toContain("0");

    /* 저장 후 입력창 표시 여부 확인*/
    expect(folderInputView.style.display).toBe("none");
  });

  test("Todo 항목 삭제 확인 - confirm 확인", () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    const folderItems = document.querySelectorAll(".folder-item");
    const deleteBtn = folderItems[0].querySelector("button");
    deleteBtn.click();

    expect(folderItems.length).toBe(TODO_LIST.length - 1);
  });

  test("Todo 항목 삭제 확인 - confirm 취소", () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(false);

    const folderItems = document.querySelectorAll(".folder-item");
    const deleteBtn = folderItems[0].querySelector("button");
    deleteBtn.click();

    expect(folderItems.length).toBe(TODO_LIST.length);
  });
});
