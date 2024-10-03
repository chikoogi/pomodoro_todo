import { renderTaskDetails } from "./renderTaskDetail.js";

export function renderTodoLists(data) {
  let todoLists = data;

  const setTodoLists = (updatedLists) => {
    todoLists = updatedLists; // 최신 상태로 업데이트
    updateFolderList(todoLists, setTodoLists); // UI 업데이트
  };

  updateFolderList(todoLists, setTodoLists);

  document.getElementById("add-folder-button").addEventListener("click", () => {
    const folderInputView = document.getElementById("folder-input-view");
    if (folderInputView.style.display === "none") {
      showInputView(todoLists, setTodoLists);
    }
  });
}

function showInputView(todoLists, setTodoLists) {
  const folderInputView = document.getElementById("folder-input-view");
  const folderInput = document.getElementById("folder-input");

  folderInputView.style.display = "block";
  folderInput.focus();

  folderInput.addEventListener("keydown", function handleKeyDown(e) {
    if (e.key === "Enter") {
      const newFolderName = folderInput.value.trim();
      if (newFolderName !== "") {
        addTodoList(todoLists, newFolderName, setTodoLists); // 목록 추가
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

function addTodoList(todoLists, newFolderName, setTodoLists) {
  const newListSet = {
    id: Date.now().toString(), // 새로운 고유 ID
    name: newFolderName,
    tasks: [],
  };
  const updatedTodoLists = [...todoLists, newListSet];
  setTodoLists(updatedTodoLists); // 상태 반영
}

function deleteTodoList(todoLists, folderId, setTodoLists) {
  const updatedTodoLists = todoLists.filter((list) => list.id !== folderId);
  setTodoLists(updatedTodoLists); // 상태 반영
}
function updateFolderList(todoLists, setTodoLists) {
  console.log(todoLists);
  const folderListElement = document.getElementById("folder-list");
  folderListElement.innerHTML = "";

  todoLists.forEach((list) => {
    const listItem = document.createElement("li");
    folderListElement.appendChild(listItem);

    const titleItem = document.createElement("div");
    listItem.appendChild(titleItem);
    titleItem.className = "todo-li-name";
    titleItem.textContent = list.name;

    const btnItem = document.createElement("div");
    listItem.appendChild(btnItem);
    btnItem.className = "todo-li-btn";

    const deleteBtn = document.createElement("button");
    btnItem.appendChild(deleteBtn);
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", (e) => {
      const chk = confirm("삭제 하시겠습니까?");
      if (chk) {
        e.stopPropagation();
        deleteTodoList(todoLists, list.id, setTodoLists); // 삭제 함수 호출
      }
    });

    const countBtn = document.createElement("span");
    btnItem.appendChild(countBtn);
    countBtn.textContent = list.tasks.length.toString();

    listItem.addEventListener("click", () => renderTaskDetails(list.tasks));
  });
}
