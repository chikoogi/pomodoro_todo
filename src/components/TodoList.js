import { Timer } from "./Timer.js";
import { TaskList } from "./TaskList.js";
import IconMenu from "./../assets/icon/menu_white.png";
import IconClose from "./../assets/icon/close_black.png";
import { saveToLocalStorage } from "../tools/localStorage.js";

export class TodoList {
  constructor(todoLists) {
    this.timer = new Timer();
    this.todoLists = todoLists;
    this.selectedItem = null;
    this.taskList = null;
  }

  init() {
    const addBtn = document.getElementById("add-folder-button");
    if (addBtn) {
      document.getElementById("add-folder-button").onclick = () => {
        const folderInputView = document.getElementById("folder-input-view");
        if (folderInputView.style.display === "none") {
          this.showInputView();
        }
      };
    }

    this.render();

    /*@TODO 첫번재 선택 임시코드*/
    // if (document.getElementById("folder-list").children[0])
    //   this.setSelectedItem(this.todoLists[0], document.getElementById("folder-list").children[0]);
  }

  render() {
    const folderListElement = document.getElementById("folder-list");
    folderListElement.innerHTML = ""; // 기존 목록 초기화

    this.todoLists.forEach((item, itemIdx) => {
      this.renderItem(item);
    });
  }

  renderItem(item) {
    const folderListElement = document.getElementById("folder-list");
    const folderEl = document.createElement("div");
    const itemIdx = this.todoLists.findIndex((v) => v.id === item.id);

    if (itemIdx === -1) {
      folderListElement.appendChild(folderEl);
    } else {
      folderListElement.insertBefore(folderEl, folderListElement.children[itemIdx]);
    }

    folderEl.className = "folder-item";
    if (this.selectedItem && this.selectedItem.id === item.id) folderEl.classList.add("selected");

    const titleItem = document.createElement("div");
    folderEl.appendChild(titleItem);
    titleItem.className = "folder-item-title";

    const imgEl = document.createElement("img");
    titleItem.appendChild(imgEl);
    imgEl.src = IconMenu;
    imgEl.width = 20;
    imgEl.height = 20;

    const textItem = document.createElement("div");
    titleItem.appendChild(textItem);
    textItem.className = "todo-li-name";
    textItem.textContent = item.name;

    const btnItem = document.createElement("div");
    folderEl.appendChild(btnItem);
    btnItem.className = "todo-li-btn";

    const deleteBtn = document.createElement("button");
    btnItem.appendChild(deleteBtn);
    deleteBtn.innerHTML = `<img src="${IconClose}">`;
    deleteBtn.className = "btn-img";
    deleteBtn.onclick = (e) => {
      const chk = confirm("삭제 하시겠습니까?");
      if (chk) {
        e.stopPropagation();
        const idx = this.todoLists.findIndex((v) => v.id === item.id);
        this.deleteTodoItem(idx); // 삭제 함수 호출
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
    const todoItem = this.todoLists[index];

    if (this.timer.activeItem) {
      const task = todoItem.tasks.find((v) => v.id === this.timer.activeItem.id);
      if (task) {
        this.timer.stop();
        this.taskList.clearHeaderTimerRender();
        this.taskList.clearTaskTimerRender(task);
      }
    }
    if (this.selectedItem.id === todoItem.id) {
      this.taskList.clear();
      this.selectedItem = null;
      this.taskList = null;
    }

    this.todoLists.splice(index, 1); // 선택한 목록을 삭제
    document.getElementById("folder-list").children[index].remove(); // 해당 항목만 삭제

    saveToLocalStorage(this.todoLists);
  }

  addTodoItem(item, index) {
    this.todoLists.splice(index, 0, item);
    this.renderItem(item); // 목록만 추가하도록 변경
    saveToLocalStorage(this.todoLists);
  }

  updateTodoItem(item) {
    const index = this.todoLists.findIndex((todo) => todo.id === item.id);

    this.render();
    saveToLocalStorage(this.todoLists);
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
