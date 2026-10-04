

const lerp = (a, b, n) => (1 - n) * a + n * b;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const dist = (dx , dy) => Math.hypot(dx , dy);
// cursor animation

const cursor = document.querySelector(".cursor");

///initial position
let mouseX = 9999;
let mouseY = 9999;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let cx = mouseX,  //current
  cy = mouseY,
  lastX = mouseX,
  lastY = mouseY;

function animateCustomCursor() {      // ani name changed
  // move the custom cursor toward the real cursor a little each frame (0.1 -> 10%)
  cx = lerp(cx, mouseX, 0.18);
  cy = lerp(cy, mouseY, 0.18);

  // strech based on  distance traveled (elapsed) from how far the mouse moved since last frame
  const dx = mouseX - lastX;
  const dy = mouseY - lastY;
  lastX = mouseX;
  lastY = mouseY;
  const clampedDist = clamp(dist(dx , dy), 0, 40);
  const stretch = 1 + clampedDist / 60;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotate(${angle}deg) scaleX(${stretch}) scaleY(${1 / (stretch * 0.4 + 0.6)}) `;

  requestAnimationFrame(animateCustomCursor)
    ; // we dont need throttle for this , bcz the animation is happening in the base of fps , the event is only storing variables each times it calls  . so its not costly .
}
animateCustomCursor();

// mouse/pointer repulsion animation

const title = document.querySelector(".hero-title");

// split each word into one <span class="ch"> per character
title.querySelectorAll(".word").forEach((word) => {
  const text = word.textContent;
  word.textContent = "";
  [...text].forEach((ch) => {
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = ch;
    if (span.textContent === span.textContent.toUpperCase()) {
      span.style.fontFamily = 'Kavoon'
       span.style.fontSize = '6vw'

    }
    word.appendChild(span);
  });
});

const chars = [...title.querySelectorAll(".ch")];
const state = chars.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
let rects = [];

// measure each character's center once, and again on resize —
// never inside the animation loop, it's expensive
function measure() {
  rects = chars.map((el) => {
    const r = el.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  });
}
measure();
window.addEventListener("resize", measure);

const RADIUS = 240;
const STRENGTH = 34;

function animate2() {
  for (let i = 0; i < chars.length; i++) {
    const r = rects[i];
    let mouse2chX = r.cx - mouseX
    let mouse2chy = r.cy - mouseY
    const d = dist(mouse2chX , mouse2chy);

    if (d < RADIUS) {
      const falloff = 1 - d / RADIUS; // 1 = right at the cursor, 0 = at the edge
      const angle = Math.atan2(r.cy - mouseY, r.cx - mouseX);
      state[i].tx = Math.cos(angle) * falloff * STRENGTH;
      state[i].ty = Math.sin(angle) * falloff * STRENGTH;
    } else {
      state[i].tx = 0;
      state[i].ty = 0;
    }

    state[i].x = lerp(state[i].x, state[i].tx, 0.14);
    state[i].y = lerp(state[i].y, state[i].ty, 0.14);
    chars[i].style.transform =
      `translate3d(${state[i].x}px, ${state[i].y}px, 0)`;
  }
  requestAnimationFrame(animate2);
}
animate2();
