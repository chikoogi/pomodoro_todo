export function getMMSSFormat(time) {
  const min = Math.floor(time / 60);
  const minStr = `0${min}`.slice(-2);

  const sec = time % 60;
  const secStr = `0${sec}`.slice(-2);

  return `${minStr}:${secStr}`;
}
