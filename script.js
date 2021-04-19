import { fromEvent, from, interval, merge, combineLatest as combLatest, asyncScheduler } from "https://unpkg.com/rxjs@6.6.7/_esm2015/index.js"
import { map, filter, tap, startWith, scan, distinctUntilChanged, skip, throttleTime, withLatestFrom, reduce, delay } from "https://unpkg.com/rxjs@6.6.7/_esm2015/operators/index.js"
import {
  createCanvasElement,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "./canvas.js"
import { DIRECTIONS, DIRECTIONS2, INITIAL_DIRECTION, CELL_SIZE, ROWS, COLS, WALLS, SPACE, ENTER, INITIAL_POSITION_P1, INITIAL_POSITION_P2, SPEED } from './constants.js'
import { nextDirection } from './functions.js'

const sprite  = new Image()
sprite.src = "./img/bomberman.png"
console.log(sprite.width)

let state = {player1: {}, player2: {}}

let canvas = createCanvasElement();
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const img = new Image()
img.src = "./img/indestructible_wall.png"


function ClearCanvas(context, width, height) {
  context.clearRect(0,0,width,height)
}

function draw(context, square) {
  context.fillStyle = square.color;
  context.fillRect(square.x, square.y, square.width, square.height)
}

const update = square => ({ ...square, y: square.y + 10 })

const tick$ = interval(5);

const keyDown$ = fromEvent(document, 'keydown')

const direction$ = keyDown$.pipe(
  map(e => DIRECTIONS[e.keyCode]),
  filter(Boolean),
  startWith({x: 0, y: 0}),
);

const keyDownMod$ = keyDown$.pipe(
  map(e => e.keyCode),

  map(x => [x, 'DOWN']),
);

const direction2$ = keyDown$.pipe(
  map(e => DIRECTIONS2[e.keyCode]),
  filter(Boolean),
  startWith({x: 0, y: 0}),
);

const keyDownFilter$ = keyDown$.pipe(
  filter(e => DIRECTIONS[e.keyCode] !== undefined )
)

const keyDownFilter2$ = keyDown$.pipe(
  filter(e => DIRECTIONS2[e.keyCode] !== undefined)
)

const keyUp$ = fromEvent(document, 'keyup');

const keys$ = keyUp$.pipe(
  withLatestFrom(keyDownFilter$, (up, down) => ({up: up.keyCode, down: down.keyCode})),
  filter(x => x.up === x.down),
  map(x => [x.up, 'UP']),
)

const keys2$ = keyUp$.pipe(
  withLatestFrom(keyDownFilter2$, (up, down) => ({up: up.keyCode, down: down.keyCode})),
  filter(x => x.up === x.down),
  map(x => [x.up, 'UP'])
)

const last$ = merge(keys$, keyDownMod$).pipe(
  map(e => [DIRECTIONS[e[0]], e[1]]),
  filter(x => Boolean(x[0])),
  map(x => x[1]),
  startWith('UP'),
)

const last2$ = merge(keys2$, keyDownMod$).pipe(
  map(e => [DIRECTIONS2[e[0]], e[1]]),
  filter(x => Boolean(x[0])),
  map(x => x[1]),
  startWith('UP'),
)

const player1$ = tick$.pipe(
  withLatestFrom(last$, direction$,(_, ekey, dir) => ({ekey, dir})),
  throttleTime(SPEED),
  filter(x => x.ekey === 'DOWN'),
  map(x => ({ direction: x.dir, walls: WALLS })),
  scan(move, INITIAL_POSITION_P1),
  startWith(INITIAL_POSITION_P1),
  tap(pos => {
    state = {...state, player1: pos}
  })
)

const player2$ = tick$.pipe(
  withLatestFrom(last2$, direction2$,(_, ekey, dir) => ({ekey, dir})),
  throttleTime(SPEED),
  filter(x => x.ekey === 'DOWN'),
  map(x => ({ direction: x.dir, walls: WALLS })),
  scan(move, INITIAL_POSITION_P2),
  startWith(INITIAL_POSITION_P2),
  tap(pos => {
    state = {...state, player2: pos}
  })
)

const bomb1$ = keyDown$.pipe(
  filter(e => e.keyCode === ENTER),
  throttleTime(2100),
  map(() => state.player1),
)

const bomb2$ = keyDown$.pipe(
  filter(e => e.keyCode === SPACE),
  throttleTime(2100),
  map(() => state.player2)
)

const putBomb1$ = bomb1$.pipe(
  map(bomb => [bomb, 0]),
)

const explotion1$ = bomb1$.pipe(
  delay(1500),
  map(bomb => [bomb, 1]),
)

const endExplotion1$ = bomb1$.pipe(
  delay(2000),
  map(bomb => [bomb,  2]),
)

const explotion2$ = bomb2$.pipe(
  delay(1500),
  map(bomb => [bomb, 1])
)

const putBomb2$ = bomb2$.pipe(
  map(bomb => [bomb,0])
)



const endExplotion2$ = bomb2$.pipe(
  delay(2000),
  map(bomb => [bomb,2])
)

const bombMerged1$ = merge(
  putBomb1$,
  explotion1$,
  endExplotion1$,
).pipe(
  startWith(['start', 2])
)

const bombMerged2$ = merge(
  putBomb2$,
  explotion2$,
  endExplotion2$,
).pipe(
  startWith(['start', 2])
)

const game$ = combLatest(
  player1$, player2$, bombMerged1$, bombMerged2$, (pos1, pos2 ,bomb1, bomb2) => ({p1: pos1, p2: pos2, b1: bomb1, b2: bomb2 })
).subscribe(nextStream)

function nextStream(game) {
  const bombs = [game.b1, game.b2];
  render(ctx, game,WALLS);
  const p2Won = bombs.some(bomb => {
    if (bomb[1] === 1) {
      return gameOver(bomb[0], game.p1)
    }
  })
  const p1Won = bombs.some(bomb => {
    if (bomb[1] === 1){
       return gameOver(bomb[0], game.p2)
    }   
  })
  if (p2Won && p1Won){
    game$.unsubscribe()
    renderText(ctx,'Lo importante es participar :)');
  } else if (p2Won || p1Won) {
    game$.unsubscribe()
    p2Won && renderText(ctx,'P2 wins');
    p1Won && renderText(ctx,'P1 wins');
  }
}

function colision(player, direccion, walls) {
  return walls.filter((wall) => {
    if ((player.x + direccion.x >= wall.x - 1 && player.x + direccion.x < wall.x + 2) && 
        (player.y + direccion.y >= wall.y - 1 && player.y + direccion.y < wall.y + 2)) {
      return true;
    }
  })
}

function move(player, y) {
  const { direction, walls } = y

  if (colision(player,direction, walls).length > 0) {
    return player
  } else if (0 <= player.x + direction.x && player.x + direction.x <= (ROWS - 1) * 2 && 
            0 <= player.y + direction.y && player.y + direction.y <= (COLS - 1) * 2) {
    const position = {
      x: player.x + direction.x,
      y: player.y + direction.y
    };
    return position;
  } else {
    return player
  }
}

function renderWalls(context, walls) {
  walls.forEach(wall => {
    const x = wall.x * (CELL_SIZE / 2);
    const y = wall.y * (CELL_SIZE / 2);

    const img = new Image()
    img.src = "./img/indestructible_wall.png"
    ctx.drawImage(img, x, y, CELL_SIZE, CELL_SIZE)
  })
}

function render(context, game, walls) {
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

function availableExplosion(centro) {
  const lista = [{x: 0, y: 1},
  {x: 0, y: -1},
  {x: 1, y: 0},
  {x: -1, y: 0},
  ]
  return lista.filter(posicion => colision(centro, posicion, WALLS).length === 0)
}

function gameOver(bomba, jugador) {
  const availables = availableExplosion(bomba);
  const isColision = availables.some(direction => {
    const x = direction.x*2 + bomba.x;
    const y = direction.y*2 + bomba.y;
    if ((jugador.x >= x - 1 && jugador.x < x + 2) && (jugador.y >= y - 1 && jugador.y < y + 2)){
      return true;
    }
  })
  return isColision;
}

function renderText(context, text) {
  context.fillStyle = "blue";
  context.font = "30px Arial";
  context.fillText(text, (CANVAS_WIDTH / 2) - 15, (CANVAS_HEIGHT / 2)); 
  return true;
}

function renderBomb(context, bombs) {
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

function renderBackground(context){
  ctx.fillStyle = 'rgba( 40, 171, 35, 1 )';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
