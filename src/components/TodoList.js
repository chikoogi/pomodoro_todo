import { Timer } from "./Timer.js";
import { TaskList } from "./TaskList.js";
import IconMenu from "/static/images/menu_white.png";
import IconClose from "/static/images/close_black.png";
import { saveToLocalStorage } from "../tools/localStorage.js";

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

    /*@TODO 첫번재 선택 임시코드*/
    // if (document.getElementById("folder-list").children[0])
    //   this.setSelectedItem(this.todoLists[0], document.getElementById("folder-list").children[0]);
  }

  render() {
    const folderListElement = document.getElementById("folder-list");
    folderListElement.innerHTML = ""; // 기존 목록 초기화

    this.todoLists.forEach((item) => {
      this.renderItem(item);
    });
  }

  renderItem(item, target = null) {
    const folderListElement = document.getElementById("folder-list");

    let folderItemEl;
    if (target) {
      folderItemEl = target;
      folderItemEl.innerHTML = "";
    } else {
      folderItemEl = document.createElement("div");
      folderListElement.appendChild(folderItemEl);
    }

    folderItemEl.className = "folder-item";
    folderItemEl.onclick = () => {
      this.setSelectedItem(item, folderItemEl);
    };

    if (this.selectedItem && this.selectedItem.id === item.id)
      folderItemEl.classList.add("selected");
    else folderItemEl.classList.remove("selected");

    const titleItem = document.createElement("div");
    folderItemEl.appendChild(titleItem);
    titleItem.className = "folder-item-title";

    const imgEl = document.createElement("img");
    titleItem.appendChild(imgEl);
    imgEl.src = `${IconMenu}`;
    imgEl.width = 20;
    imgEl.height = 20;

    const textItem = document.createElement("div");
    titleItem.appendChild(textItem);
    textItem.className = "todo-li-name";
    textItem.textContent = item.name;

    const btnItem = document.createElement("div");
    folderItemEl.appendChild(btnItem);
    btnItem.className = "todo-li-btn";

    const deleteBtn = document.createElement("button");
    btnItem.appendChild(deleteBtn);
    deleteBtn.innerHTML = `<img src="${IconClose}">`;
    deleteBtn.className = "btn-img";
    deleteBtn.onclick = (e) => {
      const chk = confirm("삭제 하시겠습니까?");
      if (chk) {
        e.stopPropagation();
        this.deleteTodoItem(item); // 삭제 함수 호출
      }
    };

    const countBtn = document.createElement("span");
    btnItem.appendChild(countBtn);
    countBtn.className = "todo-task-count";
    countBtn.textContent = item.tasks.length.toString();
  }

  setSelectedItem(item, folderEl) {
    const folderListEl = document.getElementById("folder-list");
    const selectedEl = folderListEl.querySelector(".selected");
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

  addTodoItem(item, index) {
    this.todoLists.splice(index, 0, item);
    this.renderItem(item);
    saveToLocalStorage(this.todoLists);
  }

  deleteTodoItem(todoItem) {
    const itemIdx = this.todoLists.findIndex((v) => v.id === todoItem.id);
    if (itemIdx === -1) return;
    this.todoLists.splice(itemIdx, 1); // 선택한 목록을 삭제

    /* 삭제하는 목록 중에 타이머 진행중인 할일 존재 유무*/
    if (this.timer.activeItem) {
      const task = todoItem.tasks.find((v) => v.id === this.timer.activeItem.id);
      if (task) {
        /* 있으면 타이머 정지 */
        this.timer.stop();
        this.taskList.clearHeaderTimerRender();
        this.taskList.clearTaskTimerRender(task);
      }
    }

    /* 삭제하는 목록이 선택한 목록일 경우 할일 목록 초기화 */
    if (this.selectedItem && this.selectedItem.id === todoItem.id) {
      this.taskList.clear();
      this.selectedItem = null;
      this.taskList = null;
    }

    if (document.getElementById("folder-list").children[itemIdx]) {
      document.getElementById("folder-list").children[itemIdx].remove();
    }

    saveToLocalStorage(this.todoLists);
  }

  updateTodoItem(item) {
    const idx = this.todoLists.findIndex((todo) => todo.id === item.id);
    this.todoLists.splice(idx, 1, item);

    /*const folderListEl = document.getElementById(`folder-list`);
    if (folderListEl) {
      folderListEl.querySelector(".todo-li-name").textContent = item.name;
      folderListEl.querySelector(".todo-task-count").textContent = item.tasks.length.toString();
    }*/
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
