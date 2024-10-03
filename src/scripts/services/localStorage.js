import { todoLists as defaultTodoLists } from './data.js';

// 로컬 스토리지에서 데이터 불러오기
export function loadFromLocalStorage() {
    const storedData = localStorage.getItem('todoLists');
    return storedData ? JSON.parse(storedData) : defaultTodoLists;
}

// 로컬 스토리지에 데이터 저장하기
export function saveToLocalStorage(todoLists) {
    localStorage.setItem('todoLists', JSON.stringify(todoLists));
}