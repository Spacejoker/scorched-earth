import {drawText} from '../graphics';
import {GameState} from '../types';

let lastTenFrames  = new Array(10).fill(16), frameIdx = 0;

export function drawOverlay(gs: GameState, dt: number) {
  const {players, currentPlayer} = gs;
  const player = players[currentPlayer];
  const fps = getFps(dt);

  drawText(gs, `Angle: ${player.angle}`, 10, 20);
  drawText(gs, `Power: ${player.power}`, 10, 140);
  drawText(gs, `Player: ${player.name}`, 10, 260);
  drawText(gs, `FPS: ${fps}`, 10, 580);
}


export function getFps(dt: number) {
  lastTenFrames[frameIdx] = dt;
  frameIdx += 1;
  frameIdx %= 10;
  const sum = lastTenFrames.reduce((acc, v) => acc + v, 0);
  return Math.round(10000/sum);
}
