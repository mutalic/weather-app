export default function unixToHoursMinutes(unix) {
  let date = new Date(unix * 1000);
  let hour =
    date.getHours().toString().length === 1
      ? "0" + date.getHours()
      : date.getHours();
  let minutes =
    date.getMinutes().toString().length === 1
      ? "0" + date.getMinutes()
      : date.getMinutes();
  return hour + ":" + minutes;
}
