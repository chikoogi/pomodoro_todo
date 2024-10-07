export let TODO_LIST = [
  {
    id: 1,
    name: "회사 업무 A",
    tasks: [
      {
        id: "123",
        name: "A 프로젝트 회의",
        pomodoroTime: 5,
        pomodoroCount: 3,
        completed: false,
      },
      {
        id: "456",
        name: "C 보고서 작성",
        pomodoroTime: 10,
        pomodoroCount: 1,
        completed: false,
      },
      {
        id: "789",
        name: "B 보고서 작성",
        pomodoroTime: 12,
        pomodoroCount: 2,
        completed: true,
      },
      {
        id: "191",
        name: "D 보고서 작성",
        pomodoroTime: 15,
        pomodoroCount: 0,
        completed: false,
      },
    ],
  },
  {
    id: 2,
    name: "회사 업무 B",
    tasks: [],
  },
];

export let ACTIVE_TIMER = false;
