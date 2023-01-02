import {Scene,GameState} from '../types';
import {drawPixel, drawText} from '../graphics';


let scoring : string[] = [];
export function render(gs: GameState) {
  if (gs.init) {
    init(gs);
  } else {
    gs.imageData = gs.ctx.getImageData(0, 0, gs.width, gs.height);
    for ( let i=0 ; i < 300; i++) {
      for ( let j=0 ; j < 300; j++) {
        drawPixel(i + 80, j + 170, gs, [127, 127, 127, 255]);
      }
    }
    gs.ctx.putImageData(gs.imageData, 0, 0);
    const players = [...gs.players].sort((a, b) => a.points - b.points);

    drawText(gs, `~~~~ Round over ~~~~`, 100, 260);
    for (let i=0 ; i < players.length; i++) {
      drawText(gs, `${players[i].name}: ${players[i].points}$`, 100 + (i+1) * 14, 190);
    }
  }
  if (gs.inputs.length) {
    gs.init = true;
    gs.inputs = [];
    gs.scene = Scene.FIGHT;
  }
}

function init(gs: GameState) {
  gs.init = false;
}
