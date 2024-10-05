import { Timer } from "./Timer.js";
import { TaskList } from "./TaskList.js";

export class TodoList {
  constructor(todoLists) {
    this.timer = new Timer();
    this.todoLists = todoLists;
    this.selectedItem = null;
    this.taskList = null;
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
      this.renderItem(item);
      /* const folderEl = document.createElement("div");
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
        this.setSelectedItem(item, folderEl);
      };*/
    });
  }

  renderItem(item, itemIdx) {
    const folderListElement = document.getElementById("folder-list");
    const folderEl = document.createElement("div");

    folderListElement.insertBefore(folderEl, folderListElement.children[itemIdx]);

    folderEl.className = "folder-item";
    if (this.selectedItem && this.selectedItem.id === item.id) folderEl.classList.add("selected");

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
      this.setSelectedItem(item, folderEl);
    };
  }

  setSelectedItem(item, folderEl) {
    const selectedEl = document.getElementById("folder-list").querySelector(".selected");
    if (selectedEl) {
      document
        .getElementById("folder-list")
        .querySelector(".selected")
        .classList.remove("selected");
    }
    folderEl.classList.add("selected");
    this.selectedItem = item;
    this.taskList = new TaskList(
      item.name,
      item.tasks,
      this.timer,
      this.updateTodoItem.bind(this, item),
    );
    this.taskList.init();
  }

  deleteTodoItem(index) {
    this.todoLists.splice(index, 1); // 선택한 목록을 삭제
    document.getElementById("folder-list").children[index].remove(); // 해당 항목만 삭제
  }

  addTodoItem(item, index) {
    this.todoLists.splice(index, 0, item);
    this.renderItem(item, index); // 목록만 추가하도록 변경
  }

  updateTodoItem(item) {
    const index = this.todoLists.findIndex((todo) => todo.id === item.id);

    this.deleteTodoItem(index);
    this.addTodoItem(item, index);
  }

  showInputView() {
    const folderInputView = document.getElementById("folder-input-view");
    let folderInput = document.getElementById("folder-input");

    folderInput.value = "새로운 목록";
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
        this.addTodoItem(newTodo, this.todoLists.length); // 목록 추가

        folderInputView.style.display = "none";
        folderInput.onkeydown = null;
      } else if (e.key === "Escape") {
        folderInputView.style.display = "none";
        folderInput.onkeydown = null;
      }
    };
  }
}
