import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { TODO_LIST } from "../src/tools/data.js";
import fs from "node:fs";
import path from "node:path";
import { TodoList } from "../src/components/TodoList.js";

describe("TaskList", () => {
  let todoList,
    mockTodoLists,
    html,
    mockLength = TODO_LIST.length;

  beforeEach(() => {
    html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    document.body.innerHTML = html;

    mockTodoLists = [...TODO_LIST];
    todoList = new TodoList(mockTodoLists);

    todoList.init();

    let folderItems = document.querySelectorAll(".folder-item");
    folderItems[0].onclick();
  });

  test("Task 목록이 렌더링 되는지 확인", () => {
    let folderItems = document.querySelectorAll(".folder-item");
    folderItems[0].onclick();

    folderItems[1].onclick();
  });
});
