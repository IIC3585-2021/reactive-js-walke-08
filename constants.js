export const DIRECTIONS = {
  37: { x: -1, y:  0 },
  38: { x:  0, y: -1 },
  39: { x:  1, y:  0 },
  40: { x:  0, y:  1 },
};

export const DIRECTIONS2 = {
  65: { x: -1, y:  0 },
  87: { x:  0, y: -1 },
  68: { x:  1, y:  0 },
  83: { x:  0, y:  1 },
}

export const WALLS = [
  {id: 1, x: 0*2, y: 0*2},
  {id: 2, x: 0*2, y: 1*2},
  {id: 3, x: 0*2, y: 2*2},
  {id: 4, x: 0*2, y: 3*2},
  {id: 5, x: 0*2, y: 4*2},
  {id: 6, x: 0*2, y: 5*2},
  {id: 7, x: 0*2, y: 6*2},
  {id: 8, x: 0*2, y: 7*2},
  {id: 9, x: 0*2, y: 8*2},
  {id: 10, x: 0*2, y: 9*2},
  {id: 11, x: 0*2, y: 10*2},
  {id: 12, x: 0*2, y: 11*2},
  {id: 13, x: 0*2, y: 12*2},
  {id: 14, x: 0*2, y: 13*2},
  {id: 15, x: 0*2, y: 14*2},
  {id: 16, x: 1*2, y: 0*2},
  {id: 17, x: 2*2, y: 0*2},
  {id: 18, x: 3*2, y: 0*2},
  {id: 19, x: 4*2, y: 0*2},
  {id: 20, x: 5*2, y: 0*2},
  {id: 21, x: 6*2, y: 0*2},
  {id: 22, x: 7*2, y: 0*2},
  {id: 23, x: 8*2, y: 0*2},
  {id: 24, x: 9*2, y: 0*2},
  {id: 25, x: 10*2, y: 0*2},
  {id: 26, x: 11*2, y: 0*2},
  {id: 27, x: 12*2, y: 0*2},
  {id: 28, x: 13*2, y: 0*2},
  {id: 29, x: 14*2, y: 0*2},
  {id: 30, x: 14*2, y: 1*2},
  {id: 31, x: 14*2, y: 2*2},
  {id: 32, x: 14*2, y: 3*2},
  {id: 33, x: 14*2, y: 4*2},
  {id: 34, x: 14*2, y: 5*2},
  {id: 35, x: 14*2, y: 6*2},
  {id: 36, x: 14*2, y: 7*2},
  {id: 37, x: 14*2, y: 8*2},
  {id: 38, x: 14*2, y: 9*2},
  {id: 39, x: 14*2, y: 10*2},
  {id: 40, x: 14*2, y: 11*2},
  {id: 41, x: 14*2, y: 12*2},
  {id: 42, x: 14*2, y: 13*2},
  {id: 43, x: 14*2, y: 14*2},
  {id: 44, x: 1*2, y: 14*2},
  {id: 45, x: 2*2, y: 14*2},
  {id: 45, x: 3*2, y: 14*2},
  {id: 45, x: 4*2, y: 14*2},
  {id: 45, x: 5*2, y: 14*2},
  {id: 45, x: 6*2, y: 14*2},
  {id: 45, x: 7*2, y: 14*2},
  {id: 45, x: 8*2, y: 14*2},
  {id: 45, x: 9*2, y: 14*2},
  {id: 45, x: 10*2, y: 14*2},
  {id: 45, x: 11*2, y: 14*2},
  {id: 45, x: 12*2, y: 14*2},
  {id: 45, x: 13*2, y: 14*2},
  {id: 45, x: 14*2, y: 14*2},
  {x: 2*2, y: 2*2},
  {x: 4*2, y: 2*2},
  {x: 6*2, y: 2*2},
  {x: 8*2, y: 2*2},
  {x: 10*2, y: 2*2},
  {x: 12*2, y: 2*2},
  {x: 2*2, y: 4*2},
  {x: 4*2, y: 4*2},
  {x: 6*2, y: 4*2},
  {x: 8*2, y: 4*2},
  {x: 10*2, y: 4*2},
  {x: 12*2, y: 4*2},
  {x: 2*2, y: 6*2},
  {x: 4*2, y: 6*2},
  {x: 6*2, y: 6*2},
  {x: 8*2, y: 6*2},
  {x: 10*2, y: 6*2},
  {x: 12*2, y: 6*2},
  {x: 2*2, y: 8*2},
  {x: 4*2, y: 8*2},
  {x: 6*2, y: 8*2},
  {x: 8*2, y: 8*2},
  {x: 10*2, y: 8*2},
  {x: 12*2, y: 8*2},
  {x: 2*2, y: 10*2},
  {x: 4*2, y: 10*2},
  {x: 6*2, y: 10*2},
  {x: 8*2, y: 10*2},
  {x: 10*2, y: 10*2},
  {x: 12*2, y: 10*2},
  {x: 2*2, y: 12*2},
  {x: 4*2, y: 12*2},
  {x: 6*2, y: 12*2},
  {x: 8*2, y: 12*2},
  {x: 10*2, y: 12*2},
  {x: 12*2, y: 12*2},
];

export const INITIAL_DIRECTION = DIRECTIONS[40];
export const CELL_SIZE = 40;
export const COLS = 15;
export const ROWS = 15;
export const SPACE = 32;
export const ENTER = 13;
export const SPEED = 120;
export const INITIAL_POSITION_P1 = {x: 20, y: 14};
export const INITIAL_POSITION_P2 = {x: 8, y: 14};
