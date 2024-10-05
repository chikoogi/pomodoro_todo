import "../styles/layout.css";
import { loadFromLocalStorage } from "./services/localStorage.js";
import { TodoList } from "../components/TodoList.js";

document.addEventListener("DOMContentLoaded", async () => {
  /* 레이아웃 렌더링 */
  // const app = document.getElementById("app");

  const loadHTML = async (path, elementId) => {
    const response = await fetch(path);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  };

  // 각각의 레이아웃 파일 로드
  await loadHTML("/src/layout/header.html", "header");
  await loadHTML("/src/layout/left-panel.html", "left-panel");
  await loadHTML("/src/layout/right-panel.html", "right-panel");

  // 로컬 스토리지에서 데이터를 불러옴
  let todoLists = loadFromLocalStorage();

  const todoListComponent = new TodoList(todoLists);

  todoListComponent.init();
  // 할 일 목록 렌더링
  // renderTodoLists(todoLists);
});
