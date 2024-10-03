import { renderTaskDetails } from "./renderTaskDetail.js";

// 할 일 목록을 렌더링하는 함수
export function renderTodoLists(todoLists) {
  document
    .getElementById("add-folder-button")
    .addEventListener("click", () => addTodoList(todoLists));

  updateFolderList(todoLists);
}

function addTodoList(todoLists, item) {
  const folderInputView = document.getElementById("folder-input-view");
  const folderInput = document.getElementById("folder-input");

  // 입력 뷰를 보이게 하고 입력 필드에 포커스
  folderInputView.style.display = "block";
  folderInput.focus();

  folderInput.addEventListener("keydown", function handleKeyDown(e) {
    if (e.key === "Enter") {
      const newFolderName = folderInput.value.trim();

      if (newFolderName !== "") {
        /*새 목록 객체 생성*/
        const newListSet = {
          id: todoLists.length, // 새로운 고유 id 설정
          name: newFolderName,
          tasks: [],
        };
        todoLists.push(newListSet); // 목록에 추가

        updateFolderList(todoLists); // 목록 갱신
      }

      /*input 초기화*/
      folderInput.value = "새 목록 입력";
      folderInputView.style.display = "none";

      /*키 이벤트 핸들러 제거*/
      folderInput.removeEventListener("keydown", handleKeyDown);
    } else if (e.key === "Escape") {
      /* input 초기화*/
      folderInput.value = "새 목록 입력";
      folderInputView.style.display = "none";

      // 키 이벤트 핸들러 제거
      folderInput.removeEventListener("keydown", handleKeyDown);
    }
  });
}

function updateFolderList(todoLists) {
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
      e.stopPropagation();
      todoLists = todoLists.filter((f) => f.id !== list.id);
      updateFolderList(todoLists);
    });

    const countBtn = document.createElement("span");
    btnItem.appendChild(countBtn);
    countBtn.textContent = list.tasks.length.toString();

    listItem.addEventListener("click", () => renderTaskDetails(list.tasks));
  });
}
