import "../styles/layout.css";
import { loadFromLocalStorage } from "../tools/localStorage.js";
import { TodoList } from "../components/TodoList.ts";

document.addEventListener("DOMContentLoaded", async () => {
  /* 레이아웃 렌더링 */
  // const app = document.getElementById("app");

  /*
  const loadHTML = async (path, elementId) => {
    const response = await fetch(path);
    console.log(response);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  };
*/

  /*각각의 레이아웃 파일 로드*/
  /*  await loadHTML(headerHTML, "header");
  await loadHTML(leftHTML, "left-panel");
  await loadHTML(rightHTML, "right-panel");*/

  /* 로컬 스토리지에서 데이터를 불러옴*/
  let todoLists = loadFromLocalStorage();
  const todoListComponent = new TodoList(todoLists);

  /* 할 일 목록 렌더링*/
  todoListComponent.init();
});
