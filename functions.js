import { WALLS, COLS, ROWS } from './constants.js'

export function colision(player, direccion, walls) {
  return walls.filter((wall) => {
    if ((player.x + direccion.x >= wall.x - 1 && player.x + direccion.x < wall.x + 2) && 
        (player.y + direccion.y >= wall.y - 1 && player.y + direccion.y < wall.y + 2)) {
      return true;
    }
  })
}

export function move(player, y) {
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

export function availableExplosion(centro) {
  const lista = [{x: 0, y: 1},
  {x: 0, y: -1},
  {x: 1, y: 0},
  {x: -1, y: 0},
  ]
  return lista.filter(posicion => colision(centro, posicion, WALLS).length === 0)
}

export function gameOver(bomba, jugador) {
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
