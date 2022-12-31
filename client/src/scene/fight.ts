import {NewGameParams, GameState} from '../types';


let grid: boolean[][], imgData:any;
let tankImageData: any;

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
  for (let i=0 ; i < 10; i++) {
    let y =  100 + Math.floor(Math.random() * 380);
    ctx.lineTo(i*(gs.width/10), y);
  }
  ctx.lineTo(gs.width,200);
  ctx.lineTo(gs.width,gs.height);
  ctx.lineTo(0,gs.height);
  ctx.lineTo(0,200);
  ctx.fill();

  imgData = gs.ctx.getImageData(0,0,gs.width, gs.height);
  grid = imgDataToGrid(imgData, gs.width, gs.height);
  gs.players = [{x: 25, y: 0}, {x: 575, y: 0}];
}

export function redrawFromGrid(gs: GameState) {
  for (let i=0 ; i < gs.height; i++) {
    for (let j =0; j < gs.width;  j++){
      if (grid[i][j]) {
        const idx = (i * gs.width + j)*4;
        imgData.data[idx] = 118;
        imgData.data[idx+1] = 72;
        imgData.data[idx+2] = 199;
        imgData.data[idx+3] = 255;
      } else {
        const idx = (i * gs.width + j)*4;
        imgData.data[idx] = 0;
        imgData.data[idx+1] = 0;
        imgData.data[idx+2] = 0;
        imgData.data[idx+3] = 0;
      }
    }
  }
  gs.ctx.putImageData(imgData, 0,0);
  for (const p of gs.players) {
    gs.ctx.putImageData(tankImageData, p.x, p.y);
  }
}

function fallPixels(gs: GameState) {
  for (const p of gs.players) {
    let free = true;
    while(free) {
      for (let x =0; x < 20; x++) {
        if (grid[p.y+20][p.x + x]) {
          free = false;
        }
      }
      p.y += 1;
    }
  }
}

let lastTenFrames  = new Array(10).fill(16), frameIdx = 0;
export function drawFps(gs: GameState, dt: number) {
  lastTenFrames[frameIdx] = dt;
  frameIdx += 1;
  frameIdx %= 10;
  let sum = lastTenFrames.reduce((acc, v) => acc + v, 0);
  const ctx = gs.ctx;
  ctx.font = "24px serif";
  ctx.fillText(`FPS: ${Math.round(10000/sum)}`, 24, 24);
}

export function render(gs: GameState, dt: number) {
  if (!grid) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "tank1.png";
    const ctx = gs.ctx;
    img.addEventListener("load", () => {
      // Store this guy!
      ctx.drawImage(img, 0, 0);
      img.style.display = "none";
      tankImageData = gs.ctx.getImageData(0,0,20, 20);
      redrawFromGrid(gs);
    });

    generateScene({players:2}, gs);
    fallPixels(gs);
    redrawFromGrid(gs);
  }

  redrawFromGrid(gs);
  drawFps(gs, dt);
}

  // pick color, [255,255,
//  console.log(data);
//  //debugger;
//  gs.ctx.putImageData(imgData, 0,0);
//  let ctx = gs.ctx;
//  const gradient = ctx.createLinearGradient(width/2, 0, width/2, height);
  // Add three color stops
//  gradient.addColorStop(0, "blue");
//  gradient.addColorStop(1, "red");
//
//  ctx.fillStyle = gradient;
//  ctx?.fillRect(0,0,width, height);
