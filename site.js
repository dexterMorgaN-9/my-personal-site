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


(function () {
  const btn = document.getElementById('play-toggle');
  const audio = document.getElementById('song');
  const statusEl = document.getElementById('play-status');
  if (!btn || !audio || !statusEl) return;

  btn.addEventListener('click', () => {
    audio.paused ? audio.play() : audio.pause();
  });

  audio.addEventListener('play', () => {
    btn.classList.add('is-playing');
    statusEl.textContent = 'now playing';
  });
  audio.addEventListener('pause', () => {
    btn.classList.remove('is-playing');
    statusEl.textContent = 'paused';
  });
  audio.addEventListener('ended', () => {
    btn.classList.remove('is-playing');
    statusEl.textContent = 'paused';
  });
})();

(function () {
  const el = document.getElementById('local-time');
  if (!el) return;

  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  function tick() {
    el.textContent = fmt.format(new Date());
  }
  tick();
  setInterval(tick, 15000);
})();

(function () {
  const el = document.getElementById('local-temp');
  if (!el) return;

  const apiKey = 'aa7773d2b22243b0901173540261207';
  const city = 'Patna';
  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`)
    .then(r => r.json())
    .then(data => {
      const tmp = data?.current?.temp_c;
      if (tmp != null) el.textContent = Math.round(tmp) + '°C';
    })
    .catch(() => {});
})
();