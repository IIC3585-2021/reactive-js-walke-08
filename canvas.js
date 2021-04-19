import { availableExplosion } from './functions.js'

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

export function renderText(context, text) {
  context.fillStyle = "blue";
  context.font = "30px Arial";
  context.fillText(text, (CANVAS_WIDTH / 2) - 15, (CANVAS_HEIGHT / 2)); 
  return true;
}

export function renderBomb(context, bombs) {
  bombs.forEach(bomba => {
    if (bomba[1] === 0) {
      const sprite = new Image()
      sprite.src = "./img/bomberman.png"
      const rows = 5;
      const cols = 12;
      let frameWidth = sprite.width / cols;
      let frameHeight = sprite.height / rows;
      if (bomba === bombs[0]){
        context.drawImage(sprite, 9* frameWidth-1, 0 * frameHeight+4, frameWidth-2, frameHeight, bomba[0].x*(CELL_SIZE / 2), bomba[0].y*(CELL_SIZE / 2), CELL_SIZE, CELL_SIZE);
      } else {
        context.drawImage(sprite, 9* frameWidth-1, 1 * frameHeight+4, frameWidth-2, frameHeight, bomba[0].x*(CELL_SIZE / 2), bomba[0].y*(CELL_SIZE / 2), CELL_SIZE, CELL_SIZE);
      }
    } else if (bomba[1] === 1) {
      const bombita = new Image()
      bombita.src = "./img/Bomb_explode_2.png"
      context.drawImage(bombita, bomba[0].x*(CELL_SIZE / 2), bomba[0].y*(CELL_SIZE / 2),
      CELL_SIZE, CELL_SIZE)
      const availables = availableExplosion(bomba[0])
      availables.forEach(posicion => {
        const x = bomba[0].x + posicion.x*2
        const y = bomba[0].y + posicion.y*2
        const bombita = new Image()
        bombita.src = "./img/Bomb_explode_2.png"
        context.drawImage(bombita, x*(CELL_SIZE / 2), y*(CELL_SIZE / 2),
        CELL_SIZE, CELL_SIZE)
      })
    } 
  })
}

export function renderBackground(context){
  context.fillStyle = 'rgba( 40, 171, 35, 1 )';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function renderWalls(context, walls) {
  walls.forEach(wall => {
    const x = wall.x * (CELL_SIZE / 2);
    const y = wall.y * (CELL_SIZE / 2);

    const img = new Image();
    img.src = "./img/indestructible_wall.png";
    context.drawImage(img, x, y, CELL_SIZE, CELL_SIZE);
  })
}

export function render(context, game, walls) {
  renderBackground(context);
  const positions = { p1: game.p1, p2: game.p2 }
  const bombs = [game.b1, game.b2]
  
  for (const prop in positions) {
    const x = positions[prop].x * (CELL_SIZE / 2);
    const y = positions[prop].y * (CELL_SIZE / 2);
    const sprite = new Image()
    if (prop === "p1") {
      sprite.src = "./img/bomberman.png"
    } else {
      sprite.src = "./img/bomberman2.png"
    }
    const rows = 4;
    const cols = 10;
    let frameWidth = sprite.width / cols;
    let frameHeight = sprite.height / rows;
    context.drawImage(sprite, 2* frameWidth+4, 0 * frameHeight, frameWidth, frameHeight, 
    x, y, CELL_SIZE, CELL_SIZE);
  } 
  renderBomb(context, bombs)
  renderWalls(context, walls)
}
