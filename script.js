/* =====================================================
   Royal Marathi Wedding — Interactions
   ===================================================== */

// ----- Loader -----
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => loader.classList.add("hide"), 1000);
  }
  AOS.init({ 
    duration: 800, 
    once: true, 
    offset: 50
  });
  updateVH();
});

// ----- Custom cursor -----
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    dot.style.left = ring.style.left = e.clientX + "px";
    dot.style.top = ring.style.top = e.clientY + "px";
  });
  document.querySelectorAll("a, button, .cd-card, .couple-card, .t-card, .masonry img, .upload-label")
    .forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("grow"));
      el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
    });
} else {
  if (dot) {
    dot.style.display = "none";
    dot.remove();
  }
  if (ring) {
    ring.style.display = "none";
    ring.remove();
  }
}

// ----- Nav scroll & mobile menu -----
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");
const scrollProgress = document.getElementById("scrollProgress");

let ticking = false;
// Use passive listener for better mobile scroll performance
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      nav.classList.toggle("scrolled", scrollY > 20);
      
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      if (scrollProgress) scrollProgress.style.width = pct + "%";
      
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Fix for mobile VH units (address bar resize issue)
function updateVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

hamburger.addEventListener("click", () => {
  // Prevent scrolling when menu is open on mobile
  if (!navLinks.classList.contains("open")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  hamburger.classList.remove("open");
  navLinks.classList.remove("open");
  document.body.style.overflow = "";
}));

// ----- Theme toggle -----
const themeBtn = document.getElementById("themeToggle");
themeBtn.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", cur);
  themeBtn.textContent = cur === "dark" ? "☀" : "☾";
  localStorage.setItem("theme", cur);
});
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeBtn.textContent = "☀";
}

// ----- Audio toggle -----
const audio = document.getElementById("bgMusic");
const audioBtn = document.getElementById("audioToggle");
let playing = false;
audioBtn.addEventListener("click", () => {
  if (playing) { audio.pause(); audioBtn.textContent = "♪"; }
  else { audio.play().catch(()=>{}); audioBtn.textContent = "❚❚"; }
  playing = !playing;
});

// ----- Countdown -----
const WEDDING = new Date("2026-05-28T11:11:00+05:30").getTime();
function tick() {
  const now = Date.now();
  let diff = Math.max(0, WEDDING - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  
  const pad = n => String(n).padStart(2, "0");
  document.getElementById("cd-days").textContent = pad(d);
  document.getElementById("cd-hours").textContent = pad(h);
  document.getElementById("cd-mins").textContent = pad(m);
  document.getElementById("cd-secs").textContent = pad(s);
}
const timerInterval = setInterval(tick, 1000); tick();

// ----- Particles -----
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resize() {
  updateVH();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = window.innerWidth < 768 ? 20 : 50;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4, vy: Math.random() * 0.3 + 0.1,
    a: Math.random() * 0.6 + 0.2,
  }));
}

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 200);
});
resize();

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${p.a})`;
    ctx.shadowBlur = 10; ctx.shadowColor = "#d4af37";
    ctx.fill();
    p.y -= p.vy;
    if (p.y < -5) { p.y = window.innerHeight + 5; p.x = Math.random() * window.innerWidth; }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ----- Floating petals -----
const petalContainer = document.getElementById("petals");
function initPetals() {
  if (!petalContainer) return;
  petalContainer.innerHTML = "";
  const count = window.innerWidth < 768 ? 8 : 15;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = (8 + Math.random() * 10) + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    p.style.transform = `scale(${0.5 + Math.random() * 0.8})`;
    petalContainer.appendChild(p);
  }
}
initPetals();

// ----- RSVP localStorage -----
const rsvpForm = document.getElementById("rsvpForm");
rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(rsvpForm);
  const data = Object.fromEntries(fd.entries());
  data.ts = new Date().toISOString();
  const all = JSON.parse(localStorage.getItem("rsvps") || "[]");
  all.push(data);
  localStorage.setItem("rsvps", JSON.stringify(all));
  document.getElementById("rsvpThanks").hidden = false;
  rsvpForm.reset();
});

// ----- Guest upload -----
const upload = document.getElementById("guestUpload");
const guestGallery = document.getElementById("guestGallery");
function renderGuest() {
  const imgs = JSON.parse(localStorage.getItem("guestImgs") || "[]");
  guestGallery.innerHTML = imgs.map(src => `<img src="${src}" alt="guest">`).join("");
}
upload.addEventListener("change", (e) => {
  [...e.target.files].forEach(f => {
    const reader = new FileReader();
    reader.onload = ev => {
      const imgs = JSON.parse(localStorage.getItem("guestImgs") || "[]");
      imgs.push(ev.target.result);
      localStorage.setItem("guestImgs", JSON.stringify(imgs));
      renderGuest();
    };
    reader.readAsDataURL(f);
  });
});
renderGuest();

// ----- Lightbox -----
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

document.addEventListener("click", e => {
  if (e.target.tagName === "IMG" && (e.target.closest(".masonry") || e.target.closest(".guest-gallery"))) {
    lightboxImg.src = e.target.src;
    lightbox.classList.add("open");
  }
  if (e.target.classList.contains("lb-close") || e.target === lightbox) {
    lightbox.classList.remove("open");
  }
});

// ----- Add to calendar (.ics) -----
document.getElementById("calBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
    "SUMMARY:Aarav weds Saanvi",
    "DTSTART:20260528T053000Z",
    "DTEND:20260528T100000Z",
    "LOCATION:Shaniwar Wada Gardens, Pune",
    "DESCRIPTION:Wedding Ceremony of Aarav & Saanvi",
    "END:VEVENT", "END:VCALENDAR"
  ].join("\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "aarav-saanvi-wedding.ics";
  a.click();
});
