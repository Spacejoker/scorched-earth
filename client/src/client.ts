import "./styles.css"

const w = 600;
const h = 480;

function drawLandscape() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (canvas?.getContext) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(w/2, 0, w/2, h);
      // Add three color stops
      gradient.addColorStop(0, "blue");
      gradient.addColorStop(1, "red");

      ctx.fillStyle = gradient;
      ctx?.fillRect(0,0,w, h);

      // draw foreground:
      ctx.fillStyle = 'green';;
      ctx.beginPath();
      ctx.moveTo(0, 200);
      for (let i=0 ; i < 10; i++) {
        let y =  100 + Math.floor(Math.random() * 380);
        ctx.lineTo(i*(w/10), y);
      }
      ctx.lineTo(w,200);
      ctx.lineTo(w,h);
      ctx.lineTo(0,h);
      ctx.lineTo(0,200);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = "24px serif";
      ctx.fillText("Text is easy...", 10, 50);
    }
  }
}

let dirty = true;

function animate() {
  if (dirty) {
    drawLandscape();
    dirty = false;
  }
  requestAnimationFrame(animate)
  render()
}

function render() {
  console.log('render...');
}

animate();

//registerEventHandlers({clearScene, requestDataAndAddToScene, walls: []}, camera);
