import {NewGameParams, GameState} from '../types';


let grid: boolean[][], imgData:any;

function imgDataToGrid(imgData: any, width: number, height: number) : any {
  console.log('oh bar');

  const grid = new Array(height).fill(false).map(() =>new Array(width).fill(false));

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

export function generateScene({width, height, players}: NewGameParams, gs: GameState) {

  const ctx = gs.ctx;
  // Fill with some algo
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(0, 200);
  for (let i=0 ; i < 10; i++) {
    let y =  100 + Math.floor(Math.random() * 380);
    ctx.lineTo(i*(width/10), y);
  }
  ctx.lineTo(width,200);
  ctx.lineTo(width,height);
  ctx.lineTo(0,height);
  ctx.lineTo(0,200);
  ctx.fill();

  imgData = gs.ctx.getImageData(0,0,width, height);
  console.log('going');
  grid = imgDataToGrid(imgData, width, height);
  for (let i=0 ; i < height; i++) {
    for (let j =0; j < width;  j++){
      if (grid[i][j]) {
        const idx = (i * width + j)*4;
        imgData.data[idx] = 118;
        imgData.data[idx+1] = 72;
        imgData.data[idx+2] = 199;
        imgData.data[idx+3] = 255;
      }
    }
  }
  ctx.putImageData(imgData, 0,0);
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
}

export function render(gs: GameState) {
  if (!grid) {
    generateScene({players:2, width: 600, height: 480}, gs);
  }
}
