export function nextDirection(previous, next) {
  const isOpposite = (previous, next) =>
    next.x === -previous.x ||
    next.y === -previous.y;

  return isOpposite(previous, next)
    ? previous
    : next;
}
