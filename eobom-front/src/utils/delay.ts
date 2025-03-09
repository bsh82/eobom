export const runAfterDelay = (delay: number, callback: () => void) => {
  setTimeout(callback, delay * 1000);
}