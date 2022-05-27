export function debugAssert(
  expr: boolean,
  msg: string = "The condition does not meet",
): asserts expr is true {
  if (!expr) {
    throw new Error(msg);
  }
}
