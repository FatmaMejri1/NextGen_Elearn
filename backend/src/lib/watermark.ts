/**
 * watermark.ts: Dynamic Canvas watermark overlay helper.
 * This is designed to run in the client browser. It overlays a transparent canvas 
 * with the student's email/identifier at random positions, changing periodically 
 * to prevent screen recording and scraping.
 */

export function injectCanvasWatermark(containerElement: HTMLElement, userIdentifier: string) {
  if (typeof window === 'undefined') return;

  // Remove any existing nextgen watermark
  const existing = containerElement.querySelector('.nextgen-watermark');
  if (existing) {
    existing.remove();
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'nextgen-watermark';
  
  // Style the canvas to cover the container perfectly and ignore pointer events
  Object.assign(canvas.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999',
  });

  containerElement.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resizeCanvas() {
    canvas.width = containerElement.clientWidth;
    canvas.height = containerElement.clientHeight;
    drawWatermark();
  }

  // Draw the identifier at a random location with rotation
  let posX = 50;
  let posY = 50;

  function updateRandomPosition() {
    if (canvas.width > 0 && canvas.height > 0) {
      posX = Math.random() * (canvas.width - 250) + 50;
      posY = Math.random() * (canvas.height - 100) + 50;
    }
  }

  function drawWatermark() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Highly transparent white
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    
    // Translate and rotate slightly to prevent simple cropping
    ctx.translate(posX, posY);
    ctx.rotate(-15 * Math.PI / 180);
    ctx.fillText(userIdentifier, 0, 0);
    ctx.restore();
  }

  // Set up resize listener
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Periodically change positions to throw off recording software
  const positionInterval = setInterval(() => {
    updateRandomPosition();
    drawWatermark();
  }, 10000); // changes every 10 seconds

  // Return clean-up function
  return () => {
    window.removeEventListener('resize', resizeCanvas);
    clearInterval(positionInterval);
    canvas.remove();
  };
}
