export function executeAfter(timeout: number, execute: () => void): VoidFunction {
  let timeoutId = -1

  timeoutId = window.setTimeout(execute, timeout)

  return () => timeoutId >= 0 && window.clearTimeout(timeoutId)
}
