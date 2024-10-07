export function loadFromLocalStorage() {
  const storedData = localStorage.getItem("TODO_LIST");
  return storedData ? JSON.parse(storedData) : [];
}

// 로컬 스토리지에 데이터 저장하기
export function saveToLocalStorage(todoLists) {
  localStorage.setItem("TODO_LIST", JSON.stringify(todoLists));
}
