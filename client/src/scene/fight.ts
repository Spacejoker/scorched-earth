import {Pixel, Sprite, NewGameParams, GameState} from '../types';
import {getPixel, drawPixel} from '../graphics';
import {nextInt} from '../math';
import {updateState} from './fight_physics';
import {FightStage} from './fight_model';

let  imgData:any;
let tankImageData: Sprite;
let lastTenFrames  = new Array(10).fill(16), frameIdx = 0;
let pixelColor: Pixel;

export function render(gs: GameState, dt: number) {
  if (!gs.grid) {
    init(gs);
  } else {
    renderState(gs, dt);
  }
}

export function drawFps(gs: GameState, dt: number) {
  lastTenFrames[frameIdx] = dt;
  frameIdx += 1;
  frameIdx %= 10;
  let sum = lastTenFrames.reduce((acc, v) => acc + v, 0);
  const ctx = gs.ctx;
  ctx.font = "24px serif";
  ctx.fillText(`FPS: ${Math.round(10000/sum)}`, 24, 24);
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
  gs.players = [{x: 25, y: 0}, {x: 575, y: 0}];
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

function placePlayers(gs: GameState) {
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
  drawFps(gs, dt);
}

function drawAgents(gs: GameState) {
  if (tankImageData) {
    for (const player of gs.players) {
      for (let i =0 ; i < tankImageData.height; i++) {
        for (let j =0 ; j < tankImageData.width; j++) {
          const pixel = getPixel(tankImageData, i, j);
          drawPixel(i + player.y, j + player.x, gs, pixel);
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
  const player = gs.players[0];
  gs.projectiles.push({
    x: player.x,
    y: player.y,
    v: [-5, 5],
    width: 2,
    height: 2,
  });
}

function processInputs(gs: GameState) {
  while(gs.inputs.length) {
    const event = gs.inputs.pop()!;
    switch(event.code) {
      case "Space":
        shoot(gs);
        break;
    }
  }
}

