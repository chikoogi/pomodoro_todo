import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Timer } from "../src/components/Timer.ts";

describe("Timer 테스트", () => {
  let timer, initState;

  beforeEach(() => {
    jest.useFakeTimers();
    timer = new Timer();
    initState = {
      remainingTime: timer.remainingTime,
      interval: timer.interval,
      activeItem: timer.activeItem,
      elTextContent: timer.el.textContent,
    };
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("타이머 시작 후 완료함수가 실행되는지 확인", () => {
    const onIncreaseCount = jest.fn();
    timer.setRemainingTime(1);
    timer.start(onIncreaseCount);

    jest.advanceTimersByTime(60 * 1000);
    expect(timer.remainingTime).toBe(0);

    jest.advanceTimersByTime(60 * 1000 + 1000);
    expect(onIncreaseCount).toHaveBeenCalled();
  });
  test("타이머 정지 후 타이머가 초기화 되는지 확인", () => {
    const onIncreaseCount = jest.fn();
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    timer.setRemainingTime(1);
    timer.start(onIncreaseCount);

    jest.advanceTimersByTime(30 * 1000);
    expect(timer.remainingTime).toBe(30);

    timer.stop();
    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(onIncreaseCount).not.toHaveBeenCalled();
    expect(timer.remainingTime).toBe(initState.remainingTime);
    expect(timer.interval).toBeNull();
    expect(timer.activeItem).toBeNull();
    expect(timer.el.textContent).toBe(initState.elTextContent);
  });
  test("타이머 일시정지하면 시간이 정지하고 재시작하면 다시 일시정지한 시간부터 시작되는지 확인", () => {
    const onIncreaseCount = jest.fn();
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const setIntervalSpy = jest.spyOn(global, "setInterval");

    timer.setRemainingTime(1);
    timer.start(onIncreaseCount);

    /*타이머가 실행되고 30초 후를 시뮬레이션*/
    jest.advanceTimersByTime(30 * 1000);

    timer.pause();
    expect(clearIntervalSpy).toHaveBeenCalled();

    /*타이머가 중지된 상태인지 확인*/
    expect(timer.remainingTime).toBe(0.5 * 60);
    expect(onIncreaseCount).not.toHaveBeenCalled();

    /*중지된 후에도 시간이 더 이상 줄어들지 않는지 확인*/
    jest.advanceTimersByTime(30 * 1000);
    expect(timer.remainingTime).toBe(0.5 * 60);
    expect(onIncreaseCount).not.toHaveBeenCalled();

    timer.restart(onIncreaseCount);
    expect(setIntervalSpy).toHaveBeenCalled();

    jest.advanceTimersByTime(30 * 1000);
    expect(timer.remainingTime).toBe(0);

    jest.advanceTimersByTime(1000);
    expect(onIncreaseCount).toHaveBeenCalled();
  });
});
