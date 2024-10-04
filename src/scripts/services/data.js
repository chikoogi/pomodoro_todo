export let TODO_LIST = [
  {
    id: 1,
    name: "회사 업무",
    tasks: [
      {
        id: "1238024137246",
        name: "A 프로젝트 회의",
        pomodoroTime: 5,
        pomodoroCount: 3,
        completed: false,
      },
      {
        id: "17243237246",
        name: "보고서 작성",
        pomodoroTime: 10,
        pomodoroCount: 1,
        completed: true,
      },
    ],
  },
  {
    id: 2,
    name: "집안 일",
    tasks: [
      {
        id: "1728024137246",
        name: "청소하기",
        pomodoroTime: 15,
        pomodoroCount: 1,
        completed: true,
      },
      { id: "1728024131234", name: "세탁", pomodoroTime: 20, pomodoroCount: 2, completed: false },
    ],
  },
];

export const ACTIVE_TIMER = false;
