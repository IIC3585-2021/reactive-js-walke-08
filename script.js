import { fromEvent, from, interval, merge, combineLatest, asyncScheduler } from "https://unpkg.com/rxjs@6.6.7/_esm2015/index.js"
import { map, filter, tap, startWith, scan, distinctUntilChanged, skip, throttleTime, withLatestFrom, reduce, delay } from "https://unpkg.com/rxjs@6.6.7/_esm2015/operators/index.js"
import { createCanvasElement, render, renderText, CANVAS_HEIGHT, CANVAS_WIDTH } from "./canvas.js"
import { DIRECTIONS, DIRECTIONS2, INITIAL_DIRECTION, CELL_SIZE, ROWS, COLS, WALLS, SPACE, ENTER, INITIAL_POSITION_P1, INITIAL_POSITION_P2, SPEED } from './constants.js'
import { move, colision, availableExplosion, gameOver } from './functions.js'

let state = {player1: {}, player2: {}}

let canvas = createCanvasElement();
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const tick$ = interval(5);

const keyDown$ = fromEvent(document, 'keydown');

const keyUp$ = fromEvent(document, 'keyup');

const keyDownMod$ = keyDown$.pipe(
  map(e => e.keyCode),
  map(x => [x, 'DOWN']),
);

function generatePlayer(keyDown$, keyDownMod$, directions, init_pos, speed, num) {
  const direction$ = keyDown$.pipe(
    map(e => directions[e.keyCode]),
    filter(Boolean),
    startWith({x: 0, y: 0}),
  );

  const keyDownFilter$ = keyDown$.pipe(
    filter(e => directions[e.keyCode] !== undefined )
  )

  const keys$ = keyUp$.pipe(
    withLatestFrom(keyDownFilter$, (up, down) => ({up: up.keyCode, down: down.keyCode})),
    filter(x => x.up === x.down),
    map(x => [x.up, 'UP']),
  )

  const last$ = merge(keys$, keyDownMod$).pipe(
    map(e => [directions[e[0]], e[1]]),
    filter(x => Boolean(x[0])),
    map(x => x[1]),
    startWith('UP'),
  )

  const player$ = tick$.pipe(
    withLatestFrom(last$, direction$,(_, ekey, dir) => ({ekey, dir})),
    throttleTime(speed),
    filter(x => x.ekey === 'DOWN'),
    map(x => ({ direction: x.dir, walls: WALLS })),
    scan(move, init_pos),
    startWith(init_pos),
    tap(pos => {
      if (num === 1){
        state = {...state, player1: pos}
      } else {
        state = {...state, player2: pos}
      }
    })
  )

  return player$
}

const player1$ = generatePlayer(keyDown$, keyDownMod$, DIRECTIONS, INITIAL_POSITION_P1, SPEED, 1);
const player2$ = generatePlayer(keyDown$, keyDownMod$, DIRECTIONS2, INITIAL_POSITION_P2, SPEED, 2);

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

const game$ = combineLatest(
  player1$, player2$, bombMerged1$, bombMerged2$, (pos1, pos2 ,bomb1, bomb2) => ({p1: pos1, p2: pos2, b1: bomb1, b2: bomb2 })
).subscribe(game => nextStream(game, ctx))

function nextStream(game, context) {
  const bombs = [game.b1, game.b2];
  render(context, game,WALLS);
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
    renderText(context,'Lo importante es participar :)');
  } else if (p2Won || p1Won) {
    game$.unsubscribe()
    p2Won && renderText(context,'P2 wins');
    p1Won && renderText(context,'P1 wins');
  }
}
