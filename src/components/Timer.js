export class Timer {
  constructor() {
    this.remainingTime = 25;
    this.interval = null;
    this.activeItem = null;
  }

  initState() {
    this.remainingTime = 25;
    this.interval = null;
    this.activeItem = null;
  }

  setActiveItem(item) {
    this.activeItem = item;
  }

  setRemainingTime(time) {
    this.remainingTime = time;
  }

  is() {
    return Boolean(this.interval);
  }

  start(onInterval, onComplete) {
    if (this.interval) {
      alert("이미 실행중인 할일이 있습니다.");
      return;
    } // 이미 실행 중인 타이머가 있을 경우 무시

    this.interval = setInterval(() => {
      if (this.remainingTime <= 0) {
        clearInterval(this.interval);
        this.initState();
        if (onComplete) onComplete(); // 타이머 완료 후 호출
      } else {
        this.remainingTime--;
        if (onInterval) onInterval(this.remainingTime);
      }
    }, 1000);
  }

  restart(onInterval, onComplete) {
    this.interval = setInterval(() => {
      if (this.remainingTime <= 0) {
        clearInterval(this.interval);
        this.initState();
        if (onComplete) onComplete(); // 타이머 완료 후 호출
      } else {
        this.remainingTime--;
        if (onInterval) onInterval(this.remainingTime);
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
    clearInterval(this.interval); // 타이머 일시정지
  }
}
