import './styles.css';
import {GameState, Scene} from './types';
import * as fight from './scene/fight';
import * as scoring from './scene/scoring';

let lastT = 0;
let gs : GameState;

function initGamestate() : GameState {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  function getCursorPosition(canvas:any, event:any) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    gs.projectiles.push({x, y, v:[0,0], width:2, height: 2});
  }

  canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
  })

  if (canvas?.getContext) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      return {
        scene: Scene.FIGHT,
        ctx,
        width: 640,
        height: 480,
        players: [],
        inputs: [],
        projectiles: [],
        currentPlayer: 0,
      };
    }
  }
  throw Error('Could not init 2d context');
};

function gameloop(t:number) {
  let deltaT = t - lastT;
  lastT = t;
  // update logics
  requestAnimationFrame(gameloop)
  render(gs, deltaT)
}

function render(gs: GameState, dt: number) {
  switch(gs.scene) {
    case Scene.MAIN_MENU:
      //mainMenu.render();
      break;
    case Scene.FIGHT:
      fight.render(gs, dt);
      break;
    case Scene.SHOP:
      //mainMenu.render();
      break;
    case Scene.SCORING:
      scoring.render(gs);
      break;
  }
}

document.addEventListener("keydown", (event) => {
  gs.inputs.push(event);
});


gs = initGamestate();
gameloop(0);



