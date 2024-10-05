import { getMMSSFormat } from "../scripts/services/tools.js";

export class Timer {
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
    this.remainingTime = minTime * 60;
  }

  is() {
    return Boolean(this.interval);
  }

  start(onComplete) {
    if (this.interval) {
      // alert("이미 실행중인 할일이 있습니다.");
      return;
    } // 이미 실행 중인 타이머가 있을 경우 무시

    this.render();
    this.interval = setInterval(() => {
      if (this.remainingTime <= 0) {
        clearInterval(this.interval);
        this.initState();
        if (onComplete) onComplete(); // 타이머 완료 후 호출
      } else {
        this.remainingTime--;
        this.render();
        // if (onInterval) onInterval(this.remainingTime);
      }
    }, 1000);
  }

  restart(onComplete) {
    this.render();
    this.interval = setInterval(() => {
      if (this.remainingTime <= 0) {
        clearInterval(this.interval);
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
