import {Pixel, Sprite, NewGameParams, GameState} from '../types';
import {getPixel, drawPixel, drawText} from '../graphics';
import {nextInt} from '../math';
import {placePlayers, getShootVector, updateState} from './fight_physics';
import {drawOverlay} from './fight_overlay';

let  imgData:any;
let tankImageData: Sprite;
let pixelColor: Pixel;

export function render(gs: GameState, dt: number) {
  if (!gs.grid || gs.init) {
    init(gs);
  } else {
    renderState(gs, dt);
  }
}


// Update grid from current canvas img data
function imgDataToGrid(imgData: any, width: number, height: number) : any {
  const grid = new Array(height).fill(false).map(() => new Array(width).fill(false));

  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    let tIdx = i/4;
    if (data[i] > 0) {
      const y = Math.floor(tIdx/width);
      const x = tIdx % width;
      grid[y][x] = true;
    }
  }
  return grid;
}

export function generateScene({players}: NewGameParams, gs: GameState) {
  const ctx = gs.ctx;
  // Fill with some algo
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(0, 200);
  let changes = Math.floor(Math.random() * 5) + 5;
  for (let i=0 ; i < changes; i++) {
    let y =  100 + Math.floor(Math.random() * 380);
    ctx.lineTo(i*(gs.width/10), y);
  }
  ctx.lineTo(gs.width,200);
  ctx.lineTo(gs.width,gs.height);
  ctx.lineTo(0,gs.height);
  ctx.lineTo(0,200);
  ctx.fill();

  imgData = gs.ctx.getImageData(0,0,gs.width, gs.height);
  gs.grid = imgDataToGrid(imgData, gs.width, gs.height);
  if (gs.players.length ==0 ) {
    gs.players = [
      {x: 25, y: 0, name: 'Alice', angle: 135, power: 250, hp: 100, points: 0,},
      {x: 575, y: 0, name: 'Bob', angle: 45, power: 250, hp: 100, points: 0},
    ];
  }
  gs.currentPlayer = 0;
}

export function redrawFromGrid(gs: GameState) {
  if (!gs.grid) return;
  for (let i=0 ; i < gs.height; i++) {
    for (let j =0; j < gs.width;  j++){
      if (gs.grid[i][j]) {
        drawPixel(i, j, gs, pixelColor); 
      } else {
        drawPixel(i, j, gs, [0,0,0,0]);
      }
    }
  }
}

function init(gs: GameState) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "tank1.png";
  const ctx = gs.ctx;
  img.addEventListener("load", () => {
    // Store this guy!
    ctx.drawImage(img, 0, 0);
    img.style.display = "none";
    tankImageData = {width: 20, height: 20, data: gs.ctx.getImageData(0,0,20, 20).data};
    redrawFromGrid(gs);
  });

  pixelColor = [nextInt(256), nextInt(256), nextInt(256), 255];
  generateScene({players:2}, gs);
  placePlayers(gs);
  redrawFromGrid(gs);
  gs.init = false;
}

// Render for each frame.
function renderState(gs: GameState, dt: number) {
  updateState(gs, dt);

  // All image data related rendering
  gs.imageData = gs.ctx.getImageData(0, 0, gs.width, gs.height);
  processInputs(gs);
  redrawFromGrid(gs);
  drawAgents(gs);
  gs.ctx.putImageData(gs.imageData, 0, 0);

  // Higher level rendering (text only).
  drawOverlay(gs, dt);
}

function drawAgents(gs: GameState) {
  if (tankImageData) {
    for (let p= 0; p < gs.players.length; p++) {
      const player = gs.players[p];
      if (player.hp <= 0) continue;
      for (let i =0 ; i < tankImageData.height; i++) {
        for (let j =0 ; j < tankImageData.width; j++) {
          const pixel = getPixel(tankImageData, i, j);
          drawPixel(i + player.y, j + player.x, gs, pixel);
        }
      }
      if (p == gs.currentPlayer) {
        // draw aiming thing
        const distance = 25;
        const x0 = player.x + 10;
        const y0 = player.y + 10;
        const PI_2 = (Math.PI / 180);
        const modAngle = 180 - player.angle;
        const xv = Math.cos((modAngle) * PI_2) * distance + x0;
        const yv = y0 - Math.sin((modAngle) * PI_2) * distance;
        const offsets = [[1,0],[2,0],[-1,0],[-2,0],[0,1], [0,2], [0,-1], [0,-2]];
        for (const [a, b] of offsets) {
          drawPixel(yv + a, xv + b, gs, [255, 255, 255, 255]);
        }
      }
    }
  }

  for (const p of gs.projectiles) {
    for ( let i= p.y-1; i <= p.y+1; i++) {
      for ( let j= p.x-1; j <= p.x+1; j++) {
        drawPixel(i, j, gs, [255, 255, 255, 255]);
      }
    }
  }
}

function shoot(gs: GameState) {
  const player = gs.players[gs.currentPlayer];
  gs.projectiles.push({
    x: player.x + 20/2,
    y: player.y + 20/2,
    v: getShootVector(player),
    width: 2,
    height: 2,
  });
  gs.currentPlayer += 1;
  gs.currentPlayer %= gs.players.length;
  while(gs.players[gs.currentPlayer].hp <= 0) {
    gs.currentPlayer += 1;
    gs.currentPlayer %= gs.players.length;
  }
}

function modAngle(gs: GameState, deltaAngle: number) {
const player = gs.players[gs.currentPlayer]
  let a = player.angle;
  a += deltaAngle
  a = (a + 180) % 180;
  player.angle = a;
}

function modPower(gs: GameState, deltaPower: number) {
  const player = gs.players[gs.currentPlayer]
  let a = player.power;
  a += deltaPower
  a = Math.max(0, Math.min(1000, a));
  player.power = a;

}

function processInputs(gs: GameState) {
  while(gs.inputs.length) {
    const event = gs.inputs.pop()!;
    if (gs.projectiles.length) {
      continue;
    }
    const shiftDown = event.getModifierState("Shift");
    switch(event.code) {
      case "Space":
        shoot(gs);
        break;
      case "ArrowLeft": 
        modAngle(gs, shiftDown ? -1 : -10);
        break;
      case "ArrowRight":
        modAngle(gs, shiftDown ? 1 : 10);
        break;
      case "ArrowUp": 
        modPower(gs, shiftDown ? 1 : 10);
        break;
      case "ArrowDown":
        modPower(gs, shiftDown ? -1 : -10);
        break;
    }
  }
}

