export interface Foo {
  bar: string;
}

export interface GameState {
  mode: Scene;
  ctx: CanvasRenderingContext2D;
}

export enum Scene {
  MAIN_MENU,
  FIGHT,
  SHOP,
  SCORING,
}

export interface NewGameParams {
  players: number;
  width: number;
  height: number;
}
