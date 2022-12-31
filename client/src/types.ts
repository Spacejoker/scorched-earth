export interface Foo {
  bar: string;
}

export interface GameState {
  mode: Scene;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  players: Player[];
}

export interface Player {
  x: number;
  y: number;
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
