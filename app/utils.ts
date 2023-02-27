export const formatTime = (timeCount: number) => timeCount.toLocaleString("en-US", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});