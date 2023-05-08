// Debouncer
export default function debounce(func, wait) {
  let timeoutID = null;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutID);

    timeoutID = setTimeout(function () {
      func.apply(context, args);
      timeoutID = null;
    }, wait);
  };
}
