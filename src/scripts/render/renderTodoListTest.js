// 할 일 목록을 렌더링하고 상태를 관리하는 함수
import { loadFromLocalStorage } from "../services/localStorage.js";

export async function renderTodoListsTest() {
  let todoLists = await loadFromLocalStorage(); // 데이터 로드

  // 목록 UI 업데이트
  updateFolderList(todoLists);

  // "목록 추가" 버튼 클릭 이벤트 처리
  document.getElementById("add-folder-button").addEventListener("click", () => {
    const folderInputView = document.getElementById("folder-input-view");
    if (folderInputView.style.display === "none") {
      showInputView(todoLists);
    }
  });
}

// 폴더 목록을 업데이트하고 렌더링하는 함수
function updateFolderList(todoLists) {
  const folderListElement = document.getElementById("folder-list");
  folderListElement.innerHTML = ""; // 기존 목록 초기화

  todoLists.forEach((list) => {
    const listItem = document.createElement("li");

    // 폴더 이름 표시
    const titleItem = document.createElement("div");
    titleItem.className = "todo-li-name";
    titleItem.textContent = list.name;
    listItem.appendChild(titleItem);

    // 삭제 버튼 추가
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", () => {
      const confirmed = confirm("삭제 하시겠습니까?");
      if (confirmed) {
        deleteTodoList(todoLists, list.id);
      }
    });
    listItem.appendChild(deleteBtn);

    folderListElement.appendChild(listItem);
  });
}

// 할 일 목록을 추가하는 함수
function addTodoList(todoLists, newFolderName) {
  const newListSet = {
    id: todoLists.length + 1, // 새로운 고유 ID
    name: newFolderName,
    tasks: [],
  };
  todoLists.push(newListSet); // 상태 업데이트
  updateFolderList(todoLists); // UI 업데이트
}

// 할 일 목록을 삭제하는 함수
function deleteTodoList(todoLists, folderId) {
  const updatedTodoLists = todoLists.filter((list) => list.id !== folderId);
  updateFolderList(updatedTodoLists); // UI 업데이트
}

// 입력 뷰를 보여주고 추가 기능 처리
function showInputView(todoLists) {
  const folderInputView = document.getElementById("folder-input-view");
  const folderInput = document.getElementById("folder-input");

  folderInputView.style.display = "block";
  folderInput.focus();

  folderInput.addEventListener("keydown", function handleKeyDown(e) {
    if (e.key === "Enter") {
      const newFolderName = folderInput.value.trim();
      if (newFolderName !== "") {
        addTodoList(todoLists, newFolderName); // 목록 추가
      }

      folderInput.value = "";
      folderInputView.style.display = "none";
      folderInput.removeEventListener("keydown", handleKeyDown);
    } else if (e.key === "Escape") {
      folderInput.value = "";
      folderInputView.style.display = "none";
      folderInput.removeEventListener("keydown", handleKeyDown);
    }
  });
}
