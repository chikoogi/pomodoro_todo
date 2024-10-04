import { renderTaskDetails } from "./renderTaskDetail.js";

export function renderTodoLists(data) {
  let todoLists = data;

  const setTodoLists = (updatedLists) => {
    todoLists = updatedLists; // 최신 상태로 업데이트
    updateFolderList(todoLists, setTodoLists); // UI 업데이트
  };

  updateFolderList(todoLists, setTodoLists);

  document.getElementById("add-folder-button").onclick = () => {
    const folderInputView = document.getElementById("folder-input-view");
    // if (folderInputView.style.display === "none") {
    showInputView(todoLists, setTodoLists);
    // }
  };

  /*@TODO 임시 클릭 */
  const firstItem = document.querySelector("#folder-list li");
  firstItem.click();
}

function showInputView(todoLists, setTodoLists) {
  const folderInputView = document.getElementById("folder-input-view");
  let folderInput = document.getElementById("folder-input");

  folderInputView.style.display = "block";
  folderInput.focus();

  /* addEventListener 초기화 */
  // const clonedFolderInput = folderInput.cloneNode(true);
  // folderInput.replaceWith(clonedFolderInput);
  // folderInput = clonedFolderInput;

  folderInput.onkeydown = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      const newFolderName = folderInput.value.trim();
      if (newFolderName === "") return;

      const newTodo = {
        id: Date.now().toString(), // 새로운 고유 ID
        name: newFolderName,
        tasks: [],
      };
      addTodoList(todoLists, newTodo, setTodoLists); // 목록 추가

      folderInput.value = "새로운 목록";
      folderInputView.style.display = "none";
      folderInput.onkeydown = null;
    } else if (e.key === "Escape") {
      folderInput.value = "새로운 목록";
      folderInputView.style.display = "none";
      folderInput.onkeydown = null;
    }
  };
}

function addTodoList(todoLists, newTodo, setTodoLists) {
  const updatedTodoLists = [...todoLists, newTodo];
  setTodoLists(updatedTodoLists); // 상태 반영
}

function deleteTodoList(todoLists, folderId, setTodoLists) {
  const updatedTodoLists = todoLists.filter((list) => list.id !== folderId);
  setTodoLists(updatedTodoLists); // 상태 반영
}

function updateFolderList(todoLists, setTodoLists) {
  const folderListElement = document.getElementById("folder-list");
  folderListElement.innerHTML = "";

  todoLists.forEach((list, listIndex) => {
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
    deleteBtn.onclick = (e) => {
      const chk = confirm("삭제 하시겠습니까?");
      if (chk) {
        e.stopPropagation();
        deleteTodoList(todoLists, list.id, setTodoLists); // 삭제 함수 호출
      }
    };

    const countBtn = document.createElement("span");
    btnItem.appendChild(countBtn);
    countBtn.textContent = list.tasks.length.toString();

    listItem.onclick = () =>
      renderTaskDetails(list, (tasks) => {
        todoLists.splice(listIndex, 1, {
          ...list,
          tasks: tasks,
        });
        setTodoLists(todoLists);
      });
  });
}
