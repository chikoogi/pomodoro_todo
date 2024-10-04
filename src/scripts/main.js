import "../styles/layout.css";
import { loadFromLocalStorage, saveToLocalStorage } from "./services/localStorage.js";
import { renderTodoLists, setState, showInputView } from "./render/renderTodoList.js";

document.addEventListener("DOMContentLoaded", async () => {
  /* 레이아웃 렌더링 */
  const app = document.getElementById("app");

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

  // 할 일 목록 렌더링
  renderTodoLists(todoLists, updateTodoLists);

  // "목록 추가" 버튼에 이벤트 추가
  document.getElementById("add-folder-button").addEventListener("click", () => {
    const folderInputView = document.getElementById("folder-input-view");
    if (folderInputView.style.display === "none") {
      showInputView(todoLists, updateTodoLists);
    }
  });
});

// 상태가 변경될 때 호출하여 로컬 스토리지에 저장하는 함수
function updateTodoLists(updatedTodoLists) {
  const todoLists = updatedTodoLists;
  // localStorage.setItem("todoLists", JSON.stringify(todoLists));
  setState(todoLists); // 상태 변경을 반영
}
