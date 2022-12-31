import './styles.css';
import * as fight from './scene/fight';
import {GameState, Scene} from './types';

let lastT = 0;
let gs : GameState;

function initGamestate() : GameState {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (canvas?.getContext) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      return {
        mode: Scene.FIGHT,
        ctx,
      };
    }
  }
  throw Error('Could not init 2d context');
};

function gameloop(t:number) {
  let deltaT = t - lastT;
  lastT = t;

  // update logics
  //console.log('t passed:', deltaT);

  requestAnimationFrame(gameloop)
  render(gs)
}

function render(gs: GameState) {
  switch(gs.mode) {
    case Scene.MAIN_MENU:
      //mainMenu.render();
      break;
    case Scene.FIGHT:
      fight.render(gs);
      break;
    case Scene.SHOP:
      //mainMenu.render();
      break;
    case Scene.SCORING:
      //mainMenu.render();
      break;
  }
  //console.log('render...');
}

gs = initGamestate();
gameloop(0);
