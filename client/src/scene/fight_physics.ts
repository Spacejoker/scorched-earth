import {Player, Projectile, Pixel, Sprite, NewGameParams, GameState} from '../types';

export function updateState(gs: GameState, dt: number) {
  if (!gs.grid) return;

  let idxToDelete : number[]= [];
  const mod = dt/100;
  for (let i =0 ; i < gs.projectiles.length; i++) {
    const p = gs.projectiles[i];
    if (p.x < 0 || p.x >= gs.width || p.y >= gs.height) {
      idxToDelete.push(i);
    } else if (checkCollision(gs.grid, p)) {
      explode(gs, p.y | 0, p.x | 0, 25);
      idxToDelete.push(i);
    } else {
      p.x += p.v[1] * mod;
      p.y += p.v[0] * mod;
      p.v[0] += 0.1;
    }
  }
  gs.projectiles = gs.projectiles.filter((p, idx) => idxToDelete.indexOf(idx) != 0);
  // For each projectile - check vs grid.
}

function checkCollision(grid: boolean[][], p: Projectile) {
  for (let i = 0 ; i < p.height; i++) {
    for (let j = 0; j < p.width; j++) {
      if (checkPixel(i+p.y, j + p.x, grid)) {
        return true;
      }
    }
  }
  return false;
}

function checkPixel(y : number, x: number, grid: boolean[][]) {
  y |= 0;
  x |= 0;
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return false;
  return grid[y] && grid[y][x];
}

function explode(gs: GameState, y:number, x:number, r:number) {
  if (!gs.grid) return;

  for (let i= y - r ; i <= y + r; i++) {
    for (let j = x - r ; j <= x + r; j++) {
      const dy = i - y;
      const dx = j - x;
      if (dx * dx + dy * dy < r * r) {
        if (i >= 0 && i < gs.grid.length && j >= 0 && j < gs.grid[0].length) {
          gs.grid[i][j] = false;
        }
      }
    }
  }
}

export function getShootVector(player: Player): [number, number] {
  const {angle, power} = player;
  const PI_2 = (Math.PI / 180);
  const modAngle = 180 - angle;
  const xv = Math.cos((modAngle) * PI_2) * power / 50;
  const yv = Math.sin((modAngle) * PI_2) * power / 50;
  const res : [number, number] = [-yv, xv];
  console.log(angle, '-> ', res);
  return res;
}
