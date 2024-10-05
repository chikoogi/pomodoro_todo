import { Timer } from "./Timer.js";
import { TaskList } from "./TaskList.js";

export class TodoList {
  constructor(todoLists) {
    this.timer = new Timer();
    this.todoLists = todoLists;
    this.tasks = todoLists.map((v) => new TaskList(v.name, v.tasks, this.timer));
    this.selectedItem = null;
  }

  init() {
    document.getElementById("add-folder-button").onclick = () => {
      const folderInputView = document.getElementById("folder-input-view");
      if (folderInputView.style.display === "none") {
        this.showInputView();
      }
    };
    this.render();
  }

  render() {
    const folderListElement = document.getElementById("folder-list");
    folderListElement.innerHTML = ""; // 기존 목록 초기화

    this.todoLists.forEach((item, itemIdx) => {
      const folderEl = document.createElement("div");
      folderListElement.appendChild(folderEl);
      folderEl.className = "folder-item";

      const titleItem = document.createElement("div");
      folderEl.appendChild(titleItem);
      titleItem.className = "todo-li-name";
      titleItem.textContent = item.name;

      const btnItem = document.createElement("div");
      folderEl.appendChild(btnItem);
      btnItem.className = "todo-li-btn";

      const deleteBtn = document.createElement("button");
      btnItem.appendChild(deleteBtn);
      deleteBtn.textContent = "X";
      deleteBtn.onclick = (e) => {
        const chk = confirm("삭제 하시겠습니까?");
        if (chk) {
          e.stopPropagation();
          this.deleteTodoItem(itemIdx); // 삭제 함수 호출
        }
      };

      const countBtn = document.createElement("span");
      btnItem.appendChild(countBtn);
      countBtn.textContent = item.tasks.length.toString();

      folderEl.onclick = () => {
        this.setSelectedItem(itemIdx);
      };
    });
  }

  setSelectedItem(itemIdx) {
    const folderEl = document.createElement("div");

    if (this.selectedItem) {
      folderEl.classList.remove("selected");
    }
    folderEl.classList.add("selected");
    this.selectedItem = this.tasks[itemIdx];
    this.selectedItem.init();
  }

  deleteTodoItem(index) {
    this.todoLists.splice(index, 1); // 선택한 목록을 삭제
    this.render(); // 다시 렌더링
  }

  addTodoItem(item) {
    this.todoLists.push(item);
    this.render();
  }

  updateTodoLists(updated) {
    this.todoLists = updated;
    this.render();
  }

  showInputView() {
    const folderInputView = document.getElementById("folder-input-view");
    let folderInput = document.getElementById("folder-input");

    folderInputView.style.display = "block";
    folderInput.focus();

    folderInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        const newFolderName = folderInput.value.trim();
        if (newFolderName === "") return;

        const newTodo = {
          id: Date.now().toString(),
          name: newFolderName,
          tasks: [],
        };
        this.addTodoItem(newTodo); // 목록 추가

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
}
