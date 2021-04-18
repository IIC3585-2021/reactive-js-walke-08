export const COLS = 15;
export const ROWS = 15;
export const GAP_SIZE = 1;
export const CELL_SIZE = 40;
export const CANVAS_WIDTH = COLS * (CELL_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE);

export function createCanvasElement() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  return canvas;
}
