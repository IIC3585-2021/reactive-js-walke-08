import { fromEvent, interval, merge, combineLatest } from "https://unpkg.com/rxjs@6.6.7/_esm2015/index.js"
import { map, filter, tap, startWith, scan, throttleTime, withLatestFrom, delay } from "https://unpkg.com/rxjs@6.6.7/_esm2015/operators/index.js"
import { createCanvasElement, render, renderText } from "./canvas.js"
import { DIRECTIONS, DIRECTIONS2, WALLS, SPACE, ENTER, INITIAL_POSITION_P1, INITIAL_POSITION_P2, SPEED } from './constants.js'
import { move, gameOver } from './functions.js'

let state = {player1: {}, player2: {}}

let canvas = createCanvasElement();
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const tick$ = interval(5);

const keyDown$ = fromEvent(document, 'keydown', e => [e.keyCode, 'DOWN']);

const keyUp$ = fromEvent(document, 'keyup');

function generatePlayer(keyDown$, keyUp$, directions, init_pos, speed, num) {
  const direction$ = keyDown$.pipe(
    map(e => directions[e[0]]),
    filter(Boolean),
    startWith({x: 0, y: 0}),
  );

  const keyDownFilter$ = keyDown$.pipe(
    filter(e => directions[e[0]] !== undefined )
  )

  const keys$ = keyUp$.pipe(
    withLatestFrom(keyDownFilter$, (up, down) => ({up: up.keyCode, down: down[0]})),
    filter(x => x.up === x.down),
    map(x => [x.up, 'UP']),
  )

  const last$ = merge(keys$, keyDown$).pipe(
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

function generateBomb(keyDown$, actionKey, num) {
  const bomb$ = keyDown$.pipe(
    filter(e => e[0] === actionKey),
    throttleTime(2100),
    map(() => num === 1 ? state.player1 : state.player2),
  )

  const putBomb$ = bomb$.pipe(
    map(bomb => [bomb, 0]),
  )

  const explosion$ = bomb$.pipe(
    delay(1500),
    map(bomb => [bomb, 1]),
  )

  const endExplosion$ = bomb$.pipe(
    delay(2000),
    map(bomb => [bomb,  2]),
  )

  const bombMerged$ = merge(
    putBomb$,
    explosion$,
    endExplosion$,
  ).pipe(
    startWith(['start', 2])
  )

  return bombMerged$;
}

const player1$ = generatePlayer(keyDown$, keyUp$, DIRECTIONS, INITIAL_POSITION_P1, SPEED, 1);
const player2$ = generatePlayer(keyDown$, keyUp$, DIRECTIONS2, INITIAL_POSITION_P2, SPEED, 2);

const bombMerged1$ = generateBomb(keyDown$, ENTER, 1);
const bombMerged2$ = generateBomb(keyDown$, SPACE, 2);

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
