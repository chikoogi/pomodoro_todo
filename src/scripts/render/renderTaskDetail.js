
// 선택된 할 일 상세 정보를 렌더링하는 함수
export function renderTaskDetails(tasks) {
    const taskDetailsElement = document.getElementById('task-details');
    taskDetailsElement.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.innerHTML = `
            <p><strong>할 일:</strong> ${task.text}</p>
            <p><strong>포모도로 시간:</strong> ${task.pomodoroTime}분</p>
            <p><strong>포모도로 횟수:</strong> ${task.pomodoroCount}회</p>
            <p><strong>상태:</strong> ${task.status}</p>
        `;
        taskDetailsElement.appendChild(taskItem);
    });
}