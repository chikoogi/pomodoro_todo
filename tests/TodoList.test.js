import { TodoList } from "../src/components/TodoList.js";
import { beforeEach, describe, test, expect } from "@jest/globals";

describe("TodoList", () => {
  let todoList, mockTodoLists;

  beforeEach(() => {
    mockTodoLists = [
      { id: "1", name: "Todo 1", tasks: [] },
      { id: "2", name: "Todo 2", tasks: [] },
    ];
    todoList = new TodoList(mockTodoLists);
  });

  test("Todo 목록이 렌더링 되는지 확인", () => {
    document.body.innerHTML = `<div id="folder-list"></div>`;
    todoList.render();

    const folderItems = document.querySelectorAll(".folder-item");
    expect(folderItems.length).toBe(2);
    expect(folderItems[0].textContent).toContain("Todo 1");
    expect(folderItems[1].textContent).toContain("Todo 2");
  });
});
