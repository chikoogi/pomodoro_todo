import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { TODO_LIST } from "../src/tools/data.js";
import fs from "node:fs";
import path from "node:path";
import { TodoList } from "../src/components/TodoList.js";
import { Timer } from "../src/components/Timer.js";

/*jest.advanceTimersByTime(60000);*/

describe("Timer", () => {
  let timer;

  beforeEach(() => {
    jest.useFakeTimers();
    timer = new Timer();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("타이머 시작", () => {});
  test("타이머 종료", () => {});
  test("타이머 일시정지 및 재시작", () => {});
});
