import { renderTaskDetails } from "./renderTaskDetail.js";
// 상태를 업데이트하고 렌더링하는 함수
export function setState(updatedLists) {
  render(updatedLists); // 상태 변경 후 렌더링
}

// render 함수: todoLists를 받아 UI를 다시 그리는 함수
function render(todoLists) {
  const folderListElement = document.getElementById("folder-list");
  folderListElement.innerHTML = ""; // 기존 목록 초기화

  todoLists.forEach((list, index) => {
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
    deleteBtn.addEventListener("click", () => {
      deleteTodoList(todoLists, index); // 삭제 함수 호출
    });

    listItem.addEventListener("click", () => {
      renderTaskDetails(list, (updatedTasks) => {
        todoLists[index].tasks = updatedTasks;
        setState(todoLists); // 상태 변경 후 UI 업데이트
      });
    });
  });
}

// 할 일 목록을 삭제하는 함수
function deleteTodoList(todoLists, index) {
  const updatedTodoLists = [...todoLists];
  updatedTodoLists.splice(index, 1); // 선택한 목록을 삭제
  setState(updatedTodoLists); // 상태 업데이트 후 렌더링
}

// 입력 뷰를 보여주고 추가 기능 처리
export function showInputView(todoLists) {
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

/* legacy */
//
// export function renderTodoLists(data) {
//   let todoLists = data;
//
//   const setTodoLists = (updatedLists) => {
//     todoLists = updatedLists; // 최신 상태로 업데이트
//     updateFolderList(todoLists, setTodoLists); // UI 업데이트
//   };
//
//   updateFolderList(todoLists, setTodoLists);
//
//   document.getElementById("add-folder-button").onclick = () => {
//     const folderInputView = document.getElementById("folder-input-view");
//     // if (folderInputView.style.display === "none") {
//     showInputView(todoLists, setTodoLists);
//     // }
//   };
//
//   /*@TODO 임시 클릭 */
//   const firstItem = document.querySelector("#folder-list .folder-item");
//   firstItem.click();
// }
//
// function showInputView(todoLists, setTodoLists) {
//   const folderInputView = document.getElementById("folder-input-view");
//   let folderInput = document.getElementById("folder-input");
//
//   folderInputView.style.display = "block";
//   folderInput.focus();
//
//   /* addEventListener 초기화 */
//   // const clonedFolderInput = folderInput.cloneNode(true);
//   // folderInput.replaceWith(clonedFolderInput);
//   // folderInput = clonedFolderInput;
//
//   folderInput.onkeydown = (e) => {
//     console.log(e.key);
//     if (e.key === "Enter") {
//       const newFolderName = folderInput.value.trim();
//       if (newFolderName === "") return;
//
//       const newTodo = {
//         id: Date.now().toString(),
//         name: newFolderName,
//         tasks: [],
//       };
//       addTodoList(todoLists, newTodo, setTodoLists); // 목록 추가
//
//       folderInput.value = "새로운 목록";
//       folderInputView.style.display = "none";
//       folderInput.onkeydown = null;
//     } else if (e.key === "Escape") {
//       folderInput.value = "새로운 목록";
//       folderInputView.style.display = "none";
//       folderInput.onkeydown = null;
//     }
//   };
// }
//
// function addTodoList(todoLists, newTodo, setTodoLists) {
//   const updatedTodoLists = [...todoLists, newTodo];
//   setTodoLists(updatedTodoLists); // 상태 반영
// }
//
// function deleteTodoList(todoLists, folderId, setTodoLists) {
//   const updatedTodoLists = todoLists.filter((list) => list.id !== folderId);
//   setTodoLists(updatedTodoLists); // 상태 반영
// }
//
// function updateFolderList(todoLists, setTodoLists) {
//   const folderListElement = document.getElementById("folder-list");
//   folderListElement.innerHTML = "";
//
//   /*이전에 선택된 항목을 추적*/
//   let selectedFolderItem = null;
//
//   todoLists.forEach((list, listIndex) => {
//     const folderItem = document.createElement("div");
//     folderListElement.appendChild(folderItem);
//     folderItem.className = "folder-item";
//
//     const titleItem = document.createElement("div");
//     folderItem.appendChild(titleItem);
//     titleItem.className = "todo-li-name";
//     titleItem.textContent = list.name;
//
//     const btnItem = document.createElement("div");
//     folderItem.appendChild(btnItem);
//     btnItem.className = "todo-li-btn";
//
//     const deleteBtn = document.createElement("button");
//     btnItem.appendChild(deleteBtn);
//     deleteBtn.textContent = "X";
//     deleteBtn.onclick = (e) => {
//       const chk = confirm("삭제 하시겠습니까?");
//       if (chk) {
//         e.stopPropagation();
//         deleteTodoList(todoLists, list.id, setTodoLists); // 삭제 함수 호출
//       }
//     };
//
//     const countBtn = document.createElement("span");
//     btnItem.appendChild(countBtn);
//     countBtn.textContent = list.tasks.length.toString();
//
//     folderItem.onclick = () => {
//       // const allFolderItems = document.querySelectorAll(".folder-item");
//       // allFolderItems.forEach((item) => item.classList.remove("selected"));
//       // folderItem.classList.add("selected");
//
//       if (selectedFolderItem) {
//         selectedFolderItem.classList.remove("selected");
//       }
//       folderItem.classList.add("selected");
//       selectedFolderItem = folderItem;
//
//       renderTaskDetails(list, (tasks) => {
//         todoLists.splice(listIndex, 1, {
//           ...list,
//           tasks: tasks,
//         });
//         setTodoLists(todoLists);
//       });
//     };
//   });
// }
