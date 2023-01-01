export type Pixel = [number, number, number, number];

export interface Foo {
  bar: string;
}

export interface Projectile {
  x: number;
  y: number;
  // [y, x]
  v: [number, number];
  width: number;
  height: number;
}

export interface GameState {
  mode: Scene;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  players: Player[];
  inputs: KeyboardEvent[];
  projectiles: Projectile[];
  imageData?: ImageData;
  grid?: boolean[][];
  currentPlayer: number;
}

export interface Player {
  x: number;
  y: number;
  name: string;
  angle: number;
  power: number;
}

export enum Scene {
  MAIN_MENU,
  FIGHT,
  SHOP,
  SCORING,
}

export interface NewGameParams {
  players: number;
}

export interface Sprite {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}
