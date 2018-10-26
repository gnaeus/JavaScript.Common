/**
 * Check if two arrays contains the same set of elements
 * @param {any[]} first
 * @param {any[]} second
 */
export function setEquals(first, second) {
  if (first === second) {
    return true;
  }
  const firstSet = first.length > 100 && new Set(first);
  const secondSet = second.length > 100 && new Set(second);
  return (
    first &&
    second &&
    first.every(
      secondSet ? el => secondSet.has(el) : el => second.indexOf(el) !== -1
    ) &&
    second.every(
      firstSet ? el => firstSet.has(el) : el => first.indexOf(el) !== -1
    )
  );
}
