'use strict';

document.querySelector('#year').textContent = new Date().getFullYear();

/* Mobil menü */
const navToggle = document.querySelector('#navToggle');
const navMenu = document.querySelector('#navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* =====================================================
   Çizimler — her bölge .rgn, detay çizgileri .details
   ===================================================== */
const VIEW = 700;
const PAPER = '#ffffff';

const DRAWINGS = {
  lumi: `
    <path class="rgn" d="M120 660 L120 330 Q120 130 350 130 Q580 130 580 330
      L580 660 Z" fill="${PAPER}"/>
    <ellipse class="rgn" cx="350" cy="648" rx="250" ry="22" fill="${PAPER}"/>
    <path class="rgn" d="M92 126 c -6 -12 -26 -8 -26 6 c 0 12 14 16 26 30
      c 12 -14 26 -18 26 -30 c 0 -14 -20 -18 -26 -6 Z" fill="${PAPER}"/>
    <path class="rgn" d="M608 126 c -6 -12 -26 -8 -26 6 c 0 12 14 16 26 30
      c 12 -14 26 -18 26 -30 c 0 -14 -20 -18 -26 -6 Z" fill="${PAPER}"/>
    <path class="rgn" d="M255 66 Q258 77 269 80 Q258 83 255 94 Q252 83 241 80
      Q252 77 255 66 Z" fill="${PAPER}"/>
    <path class="rgn" d="M445 66 Q448 77 459 80 Q448 83 445 94 Q442 83 431 80
      Q442 77 445 66 Z" fill="${PAPER}"/>
    <circle class="rgn" cx="350" cy="240" r="82" fill="${PAPER}"/>
    <circle class="rgn" cx="350" cy="142" r="30" fill="${PAPER}"/>
    <ellipse class="rgn" cx="258" cy="352" rx="64" ry="15" fill="${PAPER}"
      transform="rotate(-38 258 352)"/>
    <ellipse class="rgn" cx="442" cy="352" rx="64" ry="15" fill="${PAPER}"
      transform="rotate(38 442 352)"/>
    <circle class="rgn" cx="350" cy="258" r="64" fill="${PAPER}"/>
    <path class="rgn" d="M322 322 L378 322 L392 402 L308 402 Z" fill="${PAPER}"/>
    <path class="rgn" d="M262 402 L438 402 Q476 428 462 466 Q436 498 402 484
      Q382 512 350 504 Q318 512 298 484 Q264 498 238 466 Q224 428 262 402 Z"
      fill="${PAPER}"/>
    <rect class="rgn" x="327" y="502" width="18" height="108" rx="9" fill="${PAPER}"/>
    <rect class="rgn" x="355" y="502" width="18" height="108" rx="9" fill="${PAPER}"/>
    <ellipse class="rgn" cx="336" cy="622" rx="23" ry="11" fill="${PAPER}"/>
    <ellipse class="rgn" cx="364" cy="622" rx="23" ry="11" fill="${PAPER}"/>
    <circle class="rgn" cx="315" cy="276" r="9" fill="${PAPER}"/>
    <circle class="rgn" cx="385" cy="276" r="9" fill="${PAPER}"/>
    <g class="details">
      <circle class="dot" cx="327" cy="258" r="6"/>
      <circle class="dot" cx="373" cy="258" r="6"/>
      <path d="M338 284 Q350 294 362 284"/>
      <path d="M325 165 Q350 150 375 165"/>
      <path d="M280 430 Q350 452 420 430"/>
      <path d="M330 612 L322 588"/>
      <path d="M342 612 L350 588"/>
      <path d="M358 612 L350 588"/>
      <path d="M370 612 L378 588"/>
      <path d="M140 660 L140 335 Q140 150 350 150 Q560 150 560 335 L560 660"/>
    </g>
  `,
  lino: `
    <rect class="rgn" x="25" y="25" width="650" height="650" rx="36" fill="${PAPER}"/>
    <circle class="rgn" cx="150" cy="555" r="72" fill="${PAPER}"/>
    <path class="rgn" d="M600 105 A78 78 0 0 0 600 261 A62 62 0 0 1 600 105 Z"
      fill="${PAPER}"/>
    <path class="rgn" d="M245 124 Q251 144 271 150 Q251 156 245 176 Q239 156 219 150
      Q239 144 245 124 Z" fill="${PAPER}"/>
    <path class="rgn" d="M520 460 Q525 476 541 480 Q525 484 520 500 Q515 484 499 480
      Q515 476 520 460 Z" fill="${PAPER}"/>
    <path class="rgn" d="M180 314 Q184 326 196 330 Q184 334 180 346 Q176 334 164 330
      Q176 326 180 314 Z" fill="${PAPER}"/>
    <path class="rgn" d="M350 460 Q398 515 350 595 Q302 515 350 460 Z" fill="${PAPER}"/>
    <path class="rgn" d="M350 472 Q376 512 350 560 Q324 512 350 472 Z" fill="${PAPER}"/>
    <path class="rgn" d="M288 385 L215 505 L288 470 Z" fill="${PAPER}"/>
    <path class="rgn" d="M412 385 L485 505 L412 470 Z" fill="${PAPER}"/>
    <rect class="rgn" x="288" y="240" width="124" height="215" rx="26" fill="${PAPER}"/>
    <path class="rgn" d="M350 95 L288 240 L412 240 Z" fill="${PAPER}"/>
    <circle class="rgn" cx="350" cy="320" r="48" fill="${PAPER}"/>
    <circle class="rgn" cx="350" cy="320" r="30" fill="${PAPER}"/>
    <g class="details">
      <ellipse cx="150" cy="555" rx="108" ry="26"/>
      <circle cx="125" cy="535" r="10"/>
      <circle cx="175" cy="580" r="7"/>
      <path d="M310 425 L390 425"/>
      <path d="M336 306 A18 18 0 0 1 352 294"/>
    </g>
  `,
};

/* =====================================================
   Boyama motoru
   ===================================================== */
const board = document.querySelector('#board');
const CANVAS_SIZE = 1000;
const MAX_STROKE_UNDO = 6;

let currentDrawing = 'lumi';
let mode = 'fill';
let color = '#e63946';
let undoStack = [];
let strokeSnapshots = 0;
let ctx = null;
let brushCanvas = null;
let painting = false;
let lastPoint = null;

function buildBoard(key) {
  const markup = DRAWINGS[key];
  board.innerHTML = `
    <svg class="art art--regions" viewBox="0 0 ${VIEW} ${VIEW}"
      xmlns="http://www.w3.org/2000/svg">${markup}</svg>
    <canvas width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"></canvas>
    <svg class="art art--outlines" viewBox="0 0 ${VIEW} ${VIEW}"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${markup}</svg>
  `;

  brushCanvas = board.querySelector('canvas');
  ctx = brushCanvas.getContext('2d', { willReadFrequently: true });
  undoStack = [];
  strokeSnapshots = 0;
  lastPoint = null;

  board.querySelector('.art--regions').addEventListener('click', (event) => {
    const region = event.target.closest('.rgn');
    if (!region || mode !== 'fill') return;
    const next = color === 'eraser' ? PAPER : color;
    const prev = region.getAttribute('fill');
    if (prev === next) return;
    undoStack.push({ type: 'fill', el: region, prev });
    region.setAttribute('fill', next);
  });

  brushCanvas.addEventListener('pointerdown', startStroke);
  brushCanvas.addEventListener('pointermove', moveStroke);
  brushCanvas.addEventListener('pointerup', endStroke);
  brushCanvas.addEventListener('pointercancel', endStroke);
  brushCanvas.addEventListener('pointerleave', endStroke);
}

function canvasPoint(event) {
  const rect = brushCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * CANVAS_SIZE,
    y: ((event.clientY - rect.top) / rect.height) * CANVAS_SIZE,
  };
}

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function stamp(point) {
  const isEraser = color === 'eraser';
  const radius = isEraser ? 46 : 30;
  ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  const alpha = isEraser ? 0.85 : 0.11;
  const grad = ctx.createRadialGradient(
    point.x, point.y, 0, point.x, point.y, radius
  );
  const inner = isEraser ? `rgba(0, 0, 0, ${alpha})` : hexToRgba(color, alpha);
  const mid = isEraser
    ? `rgba(0, 0, 0, ${alpha * 0.7})`
    : hexToRgba(color, alpha * 0.7);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.6, mid);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function startStroke(event) {
  if (mode !== 'brush') return;
  event.preventDefault();
  brushCanvas.setPointerCapture(event.pointerId);
  painting = true;
  undoStack.push({
    type: 'stroke',
    img: ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE),
  });
  strokeSnapshots += 1;
  if (strokeSnapshots > MAX_STROKE_UNDO) {
    const index = undoStack.findIndex((a) => a.type === 'stroke');
    if (index !== -1) {
      undoStack.splice(index, 1);
      strokeSnapshots -= 1;
    }
  }
  const point = canvasPoint(event);
  stamp(point);
  lastPoint = point;
}

function moveStroke(event) {
  if (!painting) return;
  const point = canvasPoint(event);
  const dx = point.x - lastPoint.x;
  const dy = point.y - lastPoint.y;
  const dist = Math.hypot(dx, dy);
  const step = 10;
  for (let d = step; d <= dist; d += step) {
    stamp({
      x: lastPoint.x + (dx * d) / dist,
      y: lastPoint.y + (dy * d) / dist,
    });
  }
  if (dist >= step) lastPoint = point;
}

function endStroke() {
  painting = false;
  lastPoint = null;
}

/* ---- Kontroller ---- */
document.querySelectorAll('.picker__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.picker__btn').forEach((b) => {
      b.classList.remove('is-active');
    });
    btn.classList.add('is-active');
    currentDrawing = btn.dataset.drawing;
    buildBoard(currentDrawing);
  });
});

document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach((b) => {
      b.classList.remove('is-active');
    });
    btn.classList.add('is-active');
    mode = btn.dataset.mode;
    board.classList.toggle('is-fill', mode === 'fill');
    board.classList.toggle('is-brush', mode === 'brush');
  });
});

document.querySelectorAll('.swatch').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach((b) => {
      b.classList.remove('is-active');
    });
    btn.classList.add('is-active');
    color = btn.dataset.color;
  });
});

document.querySelector('#undoBtn').addEventListener('click', () => {
  const action = undoStack.pop();
  if (!action) return;
  if (action.type === 'fill') {
    action.el.setAttribute('fill', action.prev);
  } else if (action.type === 'stroke') {
    ctx.putImageData(action.img, 0, 0);
    strokeSnapshots -= 1;
  } else if (action.type === 'clear') {
    ctx.putImageData(action.img, 0, 0);
    action.fills.forEach((f) => f.el.setAttribute('fill', f.prev));
  }
});

document.querySelector('#clearBtn').addEventListener('click', () => {
  const fills = [...board.querySelectorAll('.art--regions .rgn')]
    .filter((el) => el.getAttribute('fill') !== PAPER)
    .map((el) => ({ el, prev: el.getAttribute('fill') }));
  undoStack.push({
    type: 'clear',
    img: ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE),
    fills,
  });
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  fills.forEach((f) => f.el.setAttribute('fill', PAPER));
});

/* ---- İndir ---- */
function svgToImage(svgEl) {
  return new Promise((resolve, reject) => {
    const clone = svgEl.cloneNode(true);
    clone.setAttribute('width', CANVAS_SIZE);
    clone.setAttribute('height', CANVAS_SIZE);
    const markup = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

document.querySelector('#downloadBtn').addEventListener('click', async () => {
  const regionsSvg = board.querySelector('.art--regions');
  const outlinesSvg = board.querySelector('.art--outlines');
  const clone = outlinesSvg.cloneNode(true);
  const out = document.createElement('canvas');
  out.width = CANVAS_SIZE;
  out.height = CANVAS_SIZE;
  const outCtx = out.getContext('2d');
  outCtx.fillStyle = PAPER;
  outCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  /* Kontur klonuna stilleri satır içi uygula (harici CSS PNG'e geçmez) */
  clone.querySelectorAll('.rgn').forEach((el) => {
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', '#2f2418');
    el.setAttribute('stroke-width', '5');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('stroke-linecap', 'round');
  });
  clone.querySelectorAll('.details path, .details ellipse, .details circle')
    .forEach((el) => {
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', '#2f2418');
      el.setAttribute('stroke-width', '4');
      el.setAttribute('stroke-linecap', 'round');
    });
  clone.querySelectorAll('.details .dot').forEach((el) => {
    el.setAttribute('fill', '#2f2418');
    el.setAttribute('stroke', 'none');
  });

  const regionsClone = regionsSvg.cloneNode(true);
  const detailsGroup = regionsClone.querySelector('.details');
  if (detailsGroup) detailsGroup.remove();

  try {
    const regionsImg = await svgToImage(regionsClone);
    outCtx.drawImage(regionsImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    outCtx.drawImage(brushCanvas, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const outlinesImg = await svgToImage(clone);
    outCtx.drawImage(outlinesImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const link = document.createElement('a');
    link.download = `sulutopi-boyama-${currentDrawing}.png`;
    link.href = out.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('İndirme başarısız:', error);
  }
});

document.querySelector('#printBtn').addEventListener('click', () => {
  window.print();
});

/* Başlat */
buildBoard(currentDrawing);
