(function () {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars;

  const colors = ['#ff5266', '#f4efe1', '#7fd3ff'];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makestars() {
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      big: Math.random() < 0.04
    }));
  }

  function drawbigstar(x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const spikes = 5;
    const outer = size * 4;
    const inner = outer / 2.2;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (Math.PI / spikes) * i - Math.PI / 2;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  let t = 0;
  function draw() {
    t += 1;
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * s.speed + s.phase));
      if (s.big) {
        drawbigstar(s.x, s.y, s.r, s.color, alpha * 0.8);
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  makestars();
  draw();

  window.addEventListener('resize', () => { resize(); makestars(); });
})();


