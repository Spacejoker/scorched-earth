import {Scene, Player, Projectile, Pixel, Sprite, NewGameParams, GameState} from '../types';

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
  // Check if 1 or fewer players left -> show end screen!
  if (gs.players.filter((p) => p.hp> 0).length <= 1) {
    gs.init = true;
    console.log('scoring time!');
    gs.scene = Scene.SCORING;
  }
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

  // Explode circle on update grid 
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

  // check if player hit!
  for (let p  = 0 ; p < gs.players.length; p++) {
    const player = gs.players[p];
    const dy = y - (player.y + 10);
    const dx = x - (player.x + 10);
    if (dy * dy + dx * dx <= r * r) {
      let damage = 100;
      if (dy * dy + dx * dx > r * r / 4) {
        damage /= 2;
      }
      player.hp -= damage;
    }
  }

  for (let i =0 ; i < gs.players.length; i++) {
    if (gs.players[i].hp <= 0) console.log(`Player ${gs.players[i].name} died!`);
  }

  if (gs.players.length > 0) {
    placePlayers(gs);
  }
}

export function getShootVector(player: Player): [number, number] {
  const {angle, power} = player;
  const PI_2 = (Math.PI / 180);
  const modAngle = 180 - angle;
  const xv = Math.cos((modAngle) * PI_2) * power / 25;
  const yv = Math.sin((modAngle) * PI_2) * power / 25;
  const res : [number, number] = [-yv, xv];
  return res;
}

export function placePlayers(gs: GameState) {
  if (!gs.grid) return;

  for (const p of gs.players) {
    let free = true;
    while(free) {
      for (let x =0; x < 20; x++) {
        if (gs.grid[p.y+20][p.x + x]) {
          free = false;
        }
      }
      p.y += 1;
    }
  }
}

