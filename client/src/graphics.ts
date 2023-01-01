import {Sprite, Pixel, GameState} from './types';

export function drawPixel(y:number, x:number, gs: GameState, [r,g,b,a]: Pixel) {
  if (!gs.imageData) return;
  const imageData = gs.imageData;
        const idx = ((y|0) * gs.width + (x|0)) << 2;
  imageData.data[idx] = r;
  imageData.data[idx+1] = g;
  imageData.data[idx+2] = b;
  imageData.data[idx+3] = a;
}

export function getPixel(sprite: Sprite, y:number, x:number) : Pixel {
  const idx = (y * sprite.width + x)*4;
  const data = sprite.data;
  return [data[idx], data[idx+1], data[idx+2], data[idx+3]];
}
