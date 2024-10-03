
import { renderTaskDetails } from './renderTaskDetail.js';

// 할 일 목록을 렌더링하는 함수
export function renderTodoLists(todoLists) {
    const taskListElement = document.getElementById('task-list');
    taskListElement.innerHTML = '';

    todoLists.forEach(list => {
        const listItem = document.createElement('li');
        listItem.textContent = list.name;
        listItem.addEventListener('click', () => renderTaskDetails(list.tasks));
        taskListElement.appendChild(listItem);
    });
}