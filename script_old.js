// Hero Canvas Animation
const heroCanvas = document.getElementById("aether");
const heroCtx = heroCanvas.getContext("2d");
let w, h, dpr;
const particles = [];
const MAX = 1200;
let t = 0;

function resizeHeroCanvas() {
	dpr = Math.min(window.devicePixelRatio || 1, 2);
	w = heroCanvas.width = Math.floor(innerWidth * dpr);
	h = heroCanvas.height = Math.floor(innerHeight * dpr);
	heroCanvas.style.width = innerWidth + "px";
	heroCanvas.style.height = innerHeight + "px";
}

function rand(a, b) {
	return a + Math.random() * (b - a);
}

function angle(x, y, tt) {
	const s = Math.sin,
		c = Math.cos;
	const n =
		s(x * 0.002 + tt * 0.15) * c(y * 0.002 - tt * 0.11) +
		s((x + y) * 0.0008 + tt * 0.05);
	return n * Math.PI * 2;
}

class Particle {
	constructor() {
		this.reset(true);
	}
	reset(randomY = false) {
		this.x = rand(0, w);
		this.y = randomY ? rand(0, h) : rand(h * 0.2, h * 0.8);
		this.spd = rand(0.2, 1.6) * (w / 1600);
		this.size = rand(0.4, 1.2) * (w / 1600);
		this.hue = 260 + rand(-30, 30);
		this.life = rand(300, 900);
	}
	step() {
		const a = angle(this.x, this.y, t);
		this.x += Math.cos(a) * this.spd;
		this.y += Math.sin(a) * this.spd;
		this.life--;
		if (this.x < 0) this.x = w - 1;
		if (this.x > w) this.x = 1;
		if (this.y < 0) this.y = h - 1;
		if (this.y > h) this.y = 1;
		if (this.life <= 0) this.reset();
		heroCtx.beginPath();
		heroCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		heroCtx.fillStyle = `hsla(${this.hue}, 80%, 70%, .22)`;
		heroCtx.fill();
	}
}

function initHeroCanvas() {
	particles.length = 0;
	const count = Math.min(Math.floor((w * h) / 1500), MAX);
	for (let i = 0; i < count; i++) particles.push(new Particle());
	heroCtx.globalCompositeOperation = "lighter";
}

function fadeHeroCanvas() {
	heroCtx.globalCompositeOperation = "source-over";
	heroCtx.fillStyle = "rgba(11,11,17,.08)";
	heroCtx.fillRect(0, 0, w, h);
	heroCtx.globalCompositeOperation = "lighter";
}

let raf;
function loop() {
	fadeHeroCanvas();
	t += 0.6;
	for (const p of particles) p.step();
	raf = requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
	resizeHeroCanvas();
	initHeroCanvas();
});
resizeHeroCanvas();
initHeroCanvas();
loop();

// Wave Canvas for Manifesto Section
const waveCanvas = document.getElementById("wave-canvas");
if (waveCanvas) {
	const waveCtx = waveCanvas.getContext("2d");
	let waveTime = 0;

	function drawWave() {
		const width = (waveCanvas.width = waveCanvas.clientWidth);
		const height = (waveCanvas.height = waveCanvas.clientHeight);
		waveCtx.clearRect(0, 0, width, height);

		waveCtx.strokeStyle = "rgba(159, 122, 234, 0.3)";
		waveCtx.lineWidth = 2;

		for (let i = 0; i < 3; i++) {
			waveCtx.beginPath();
			for (let x = 0; x < width; x++) {
				const y =
					height / 2 + Math.sin(x * 0.01 + waveTime + i * 2) * 20 * (i + 1);
				if (x === 0) waveCtx.moveTo(x, y);
				else waveCtx.lineTo(x, y);
			}
			waveCtx.stroke();
		}
		waveTime += 0.05;
		requestAnimationFrame(drawWave);
	}
	drawWave();
}

// Mini Particles Canvas
const miniCanvas = document.getElementById("mini-particles");
if (miniCanvas) {
	const miniCtx = miniCanvas.getContext("2d");
	let miniParticles = [];

	function initMiniCanvas() {
		miniCanvas.width = miniCanvas.clientWidth;
		miniCanvas.height = miniCanvas.clientHeight;
		miniParticles = [];
		for (let i = 0; i < 50; i++) {
			miniParticles.push({
				x: Math.random() * miniCanvas.width,
				y: Math.random() * miniCanvas.height,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				size: Math.random() * 2,
			});
		}
	}

	function drawMiniParticles() {
		miniCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
		miniCtx.fillRect(0, 0, miniCanvas.width, miniCanvas.height);

		miniCtx.fillStyle = "rgba(34, 211, 238, 0.6)";
		miniParticles.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;
			if (p.x < 0 || p.x > miniCanvas.width) p.vx *= -1;
			if (p.y < 0 || p.y > miniCanvas.height) p.vy *= -1;

			miniCtx.beginPath();
			miniCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			miniCtx.fill();
		});
		requestAnimationFrame(drawMiniParticles);
	}

	initMiniCanvas();
	drawMiniParticles();
}

// Generative Pattern
const genPattern = document.getElementById("generative-pattern");
if (genPattern) {
	let patternTime = 0;
	function drawPattern() {
		const size = 10;
		const cols = Math.floor(genPattern.clientWidth / size);
		const rows = Math.floor(genPattern.clientHeight / size);
		genPattern.innerHTML = "";

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const dot = document.createElement("div");
				const noise =
					Math.sin(i * 0.5 + patternTime) * Math.cos(j * 0.5 + patternTime);
				dot.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${j * size}px;
          top: ${i * size}px;
          background: rgba(159, 122, 234, ${Math.abs(noise)});
          border-radius: 50%;
        `;
				genPattern.appendChild(dot);
			}
		}
		patternTime += 0.1;
	}
	setInterval(drawPattern, 100);
}

// Glitch Effect
const alphabet = "█░▒▓/\\|<>_=-+*#01";
function glitchIn(el) {
	const span = el.querySelector(".text");
	const target = span.textContent;
	let frame = 0;
	const total = 28;
	const timer = setInterval(() => {
		frame++;
		const out = target
			.split("")
			.map((ch, i) => {
				if (ch === " " || ch === "\n") return ch;
				const prog = frame / total;
				return Math.random() > prog
					? alphabet[Math.floor(Math.random() * alphabet.length)]
					: ch;
			})
			.join("");
		span.textContent = out;
		if (frame >= total) {
			clearInterval(timer);
			span.textContent = target;
		}
	}, 30);
}
glitchIn(document.querySelector(".glitch"));

// Typewriter Effect
const typewriterElement = document.getElementById("typewriter");
const phrases = [
	"We don't build technology.",
	"We craft experiences.",
	"We don't write code.",
	"We compose digital symphonies.",
	"Technology is our language.",
	"Emotion is our message.",
	"This is oneoverzero.",
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
	if (!typewriterElement) return;

	const currentPhrase = phrases[phraseIndex];

	if (!isDeleting) {
		typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
		charIndex++;

		if (charIndex === currentPhrase.length) {
			setTimeout(() => {
				isDeleting = true;
				typeWriter();
			}, 2000);
			return;
		}
	} else {
		typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
		charIndex--;

		if (charIndex === 0) {
			isDeleting = false;
			phraseIndex = (phraseIndex + 1) % phrases.length;
		}
	}

	setTimeout(typeWriter, isDeleting ? 30 : 50);
}

// Start typewriter when section is visible
const philosophySection = document.querySelector(".typewriter-section");
const philosophyObserver = new IntersectionObserver(
	(entries) => {
		if (entries[0].isIntersecting) {
			typeWriter();
			philosophyObserver.unobserve(entries[0].target);
		}
	},
	{ threshold: 0.5 }
);
if (philosophySection) philosophyObserver.observe(philosophySection);

// Card Tilt Effect
const cards = document.querySelectorAll("[data-tilt]");
cards.forEach((card) => {
	card.addEventListener("mousemove", (e) => {
		const r = card.getBoundingClientRect();
		const mx = (e.clientX - r.left) / r.width;
		const my = (e.clientY - r.top) / r.height;
		const rx = (my - 0.5) * -6;
		const ry = (mx - 0.5) * 10;
		card.style.setProperty("--mx", `${mx * 100}%`);
		card.style.setProperty("--my", `${my * 100}%`);
		card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
	});
	card.addEventListener("mouseleave", () => {
		card.style.transform = "none";
	});
});

// Reveal on Scroll
const io = new IntersectionObserver(
	(entries) => {
		for (const e of entries) {
			if (e.isIntersecting) {
				e.target.classList.add("in");
				io.unobserve(e.target);
			}
		}
	},
	{ threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
	a.addEventListener("click", (e) => {
		const id = a.getAttribute("href").slice(1);
		const target = document.getElementById(id);
		if (target) {
			e.preventDefault();
			target.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	});
});
