// ---------- Starfield background ----------
(function () {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars;

  const COLORS = ['#ff5266', '#f4efe1', '#7fd3ff'];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeStars() {
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      isBig: Math.random() < 0.04
    }));
  }

  function drawStarShape(x, y, size, color, alpha) {
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
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * s.twinkleSpeed + s.phase));
      if (s.isBig) {
        drawStarShape(s.x, s.y, s.r, s.color, alpha * 0.8);
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
  makeStars();
  draw();
  window.addEventListener('resize', () => {
    resize();
    makeStars();
  });
})();

// ---------- Song play/pause ----------
(function () {
  const btn = document.getElementById('play-toggle');
  const audio = document.getElementById('song');
  const status = document.getElementById('play-status');
  if (!btn || !audio || !status) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    btn.classList.add('is-playing');
    status.textContent = 'now playing';
  });
  audio.addEventListener('pause', () => {
    btn.classList.remove('is-playing');
    status.textContent = 'paused';
  });
  audio.addEventListener('ended', () => {
    btn.classList.remove('is-playing');
    status.textContent = 'paused';
  });
})();

// ---------- Live clock (Patna, IN = Asia/Kolkata) ----------
(function () {
  const el = document.getElementById('local-time');
  if (!el) return;
  function tick() {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    el.textContent = fmt.format(now);
  }
  tick();
  setInterval(tick, 1000 * 15);
})();

// ---------- Live-ish weather (Patna, IN via Open-Meteo, no key needed) ----------
(function () {
  const el = document.getElementById('local-temp');
  if (!el) return;
  const LAT = 25.5941, LON = 85.1376;
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`)
    .then((r) => r.json())
    .then((data) => {
      const temp = data && data.current_weather ? Math.round(data.current_weather.temperature) : null;
      if (temp !== null) el.textContent = `${temp}°C`;
    })
    .catch(() => {
      // fails quietly, keeps whatever fallback text is in the HTML
    });
})();