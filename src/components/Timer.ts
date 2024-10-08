import { getMMSSFormat } from "../tools/tools.js";
import { TaskItem } from "../interfaces/common-interface";

export class Timer {
  public remainingTime: number;
  public interval: NodeJS.Timeout | null;
  public activeItem: TaskItem | null;
  public el: HTMLDivElement;
  constructor() {
    this.remainingTime = 25 * 60;
    this.interval = null;
    this.activeItem = null;

    this.el = document.createElement("div");
    this.el.id = "timer";
    this.el.className = "timer";
    this.el.textContent = getMMSSFormat(this.remainingTime); // 초기 시간 표시
  }

  initState() {
    this.remainingTime = 25 * 60;
    this.interval = null;
    this.activeItem = null;
    this.el.textContent = getMMSSFormat(this.remainingTime); // 초기 시간 표시
  }

  render() {
    this.el.textContent = getMMSSFormat(this.remainingTime);

    const elList = document.querySelectorAll(".timer");
    elList.forEach((el) => (el.textContent = this.el.textContent));
  }

  setActiveItem(item) {
    this.activeItem = item;
  }

  setRemainingTime(minTime) {
    // this.remainingTime = minTime * 60;
    this.remainingTime = 3;
  }

  is() {
    return Boolean(this.interval);
  }

  start(onComplete: () => void) {
    if (this.interval) {
      return;
    }

    this.render();
    this.interval = setInterval(() => {
      if (this.remainingTime <= 0) {
        if (this.interval) clearInterval(this.interval);
        this.initState();
        if (onComplete) onComplete(); // 타이머 완료 후 호출
      } else {
        this.remainingTime--;
        this.render();
        // if (onInterval) onInterval(this.remainingTime);
      }
    }, 1000);
  }

  restart(onComplete: () => void) {
    this.render();
    this.interval = setInterval(() => {
      if (this.remainingTime <= 0) {
        if (this.interval) clearInterval(this.interval);
        this.initState();
        if (onComplete) onComplete(); // 타이머 완료 후 호출
      } else {
        this.remainingTime--;
        this.render();
        // if (onInterval) onInterval(this.remainingTime);
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.initState();
    }
  }

  pause() {
    if (this.interval) clearInterval(this.interval); // 타이머 일시정지
  }
}
