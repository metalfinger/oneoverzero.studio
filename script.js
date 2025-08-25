document.addEventListener("DOMContentLoaded", () => {
	// ——————————————————————————————————————————————
	//  AETHER CANVAS — mystical flow-field particles
	// ——————————————————————————————————————————————
	const heroCanvas = document.getElementById("aether");
	if (heroCanvas) {
		const heroCtx = heroCanvas.getContext("2d");
		let w, h, dpr;
		const particles = [];
		const MAX = 1200;
		let t = 0;
		let raf;

		// Mouse tracking variables
		let mouseX = 0;
		let mouseY = 0;
		let mouseInfluence = 0;
		const targetMouseInfluence = { value: 0 };

		const pr = window.matchMedia("(prefers-reduced-motion: reduce)");

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

			// Base flow field
			const n =
				s(x * 0.002 + tt * 0.15) * c(y * 0.002 - tt * 0.11) +
				s((x + y) * 0.0008 + tt * 0.05);

			// Mouse influence
			const dx = x - mouseX * dpr;
			const dy = y - mouseY * dpr;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const mouseAngle = Math.atan2(dy, dx);
			const mouseForce = Math.exp(-dist / (200 * dpr)) * mouseInfluence;

			return n * Math.PI * 2 + mouseAngle * mouseForce * 0.8;
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

		function loop() {
			fadeHeroCanvas();
			t += 0.6;

			// Smoothly interpolate mouse influence
			mouseInfluence += (targetMouseInfluence.value - mouseInfluence) * 0.05;

			for (const p of particles) p.step();
			raf = requestAnimationFrame(loop);
		}

		function startAether() {
			if (!pr.matches) {
				cancelAnimationFrame(raf);
				loop();
			}
		}
		function stopAether() {
			cancelAnimationFrame(raf);
		}

		window.addEventListener("resize", () => {
			resizeHeroCanvas();
			initHeroCanvas();
		});

		// Mouse event listeners for hero section
		heroCanvas.addEventListener("mousemove", (e) => {
			const rect = heroCanvas.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			targetMouseInfluence.value = 1.0;
		});

		heroCanvas.addEventListener("mouseenter", (e) => {
			const rect = heroCanvas.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			targetMouseInfluence.value = 1.0;
		});

		heroCanvas.addEventListener("mouseleave", () => {
			targetMouseInfluence.value = 0;
		});

		resizeHeroCanvas();
		initHeroCanvas();
		startAether();
		pr.addEventListener?.("change", (e) =>
			e.matches ? stopAether() : startAether()
		);
	}

	// ——————————————————————————————————————————————
	//  PHILOSOPHY CANVAS - Interactive Noise Shader
	// ——————————————————————————————————————————————
	const philosophyCanvas = document.getElementById("philosophy-canvas");
	if (philosophyCanvas) {
		try {
			const gl = philosophyCanvas.getContext("webgl", {
				antialias: true,
			});
			if (!gl) throw new Error("WebGL not supported");

			let philosophyRAF;
			const vertexShaderSource = `attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
			const fragmentShaderSource = `
              precision mediump float;
              uniform vec2 u_resolution; uniform float u_time; uniform vec2 u_mouse;
              float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
              void main() {
                  vec2 st = gl_FragCoord.xy/u_resolution.xy;
                  float mouse_dist = distance(st, u_mouse);
                  float noise = random(st * u_time);
                  vec3 color = vec3(noise) * vec3(0.8, 0.7, 1.0);
                  float glow = 1.0 - smoothstep(0.0, 0.2, mouse_dist);
                  gl_FragColor = vec4(color, (noise * 0.15) + (glow * 0.1));
              }`;

			const createShader = (gl, type, source) => {
				const shader = gl.createShader(type);
				gl.shaderSource(shader, source);
				gl.compileShader(shader);
				return shader;
			};

			const vertexShader = createShader(
				gl,
				gl.VERTEX_SHADER,
				vertexShaderSource
			);
			const fragmentShader = createShader(
				gl,
				gl.FRAGMENT_SHADER,
				fragmentShaderSource
			);
			const program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			gl.useProgram(program);

			const positionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
				gl.STATIC_DRAW
			);
			const positionAttributeLocation = gl.getAttribLocation(
				program,
				"a_position"
			);
			gl.enableVertexAttribArray(positionAttributeLocation);
			gl.vertexAttribPointer(
				positionAttributeLocation,
				2,
				gl.FLOAT,
				false,
				0,
				0
			);

			const resolutionUniformLocation = gl.getUniformLocation(
				program,
				"u_resolution"
			);
			const timeUniformLocation = gl.getUniformLocation(program, "u_time");
			const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
			let mousePos = { x: 0.5, y: 0.5 };

			const renderPhilosophy = (time) => {
				time *= 0.001;
				philosophyCanvas.width = philosophyCanvas.clientWidth;
				philosophyCanvas.height = philosophyCanvas.clientHeight;
				gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
				gl.uniform2f(
					resolutionUniformLocation,
					gl.canvas.width,
					gl.canvas.height
				);
				gl.uniform1f(timeUniformLocation, time);
				gl.uniform2f(mouseUniformLocation, mousePos.x, 1.0 - mousePos.y);
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
				philosophyRAF = requestAnimationFrame(renderPhilosophy);
			};

			const philosophyPanel = document.getElementById("philosophy");
			const philosophyObserver = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					!window.matchMedia("(prefers-reduced-motion: reduce)").matches
				) {
					philosophyRAF = requestAnimationFrame(renderPhilosophy);
				} else {
					cancelAnimationFrame(philosophyRAF);
				}
			});
			philosophyObserver.observe(philosophyPanel);

			philosophyPanel.addEventListener("mousemove", (e) => {
				const rect = philosophyCanvas.getBoundingClientRect();
				mousePos.x = (e.clientX - rect.left) / rect.width;
				mousePos.y = (e.clientY - rect.top) / rect.height;
			});
		} catch (error) {
			console.error("WebGL shader for philosophy section failed:", error);
			if (philosophyCanvas) philosophyCanvas.style.display = "none";
		}
	}

	// ——————————————————————————————————————————————
	//  REVEAL ON SCROLL
	// ——————————————————————————————————————————————
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add("in");
					io.unobserve(e.target);
				}
			});
		},
		{ threshold: 0.1 }
	);
	document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

	// ——————————————————————————————————————————————
	//  CARD TILT (3D hover)
	// ——————————————————————————————————————————————
	const cards = document.querySelectorAll("[data-tilt]");
	cards.forEach((card) => {
		card.addEventListener("mousemove", (e) => {
			const r = card.getBoundingClientRect();
			const mx = (e.clientX - r.left) / r.width;
			const my = (e.clientY - r.top) / r.height;
			const rx = (my - 0.5) * -8;
			const ry = (mx - 0.5) * 12;
			card.style.setProperty("--mx", `${mx * 100}%`);
			card.style.setProperty("--my", `${my * 100}%`);
			card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.05, 1.05, 1.05)`;
		});
		card.addEventListener("mouseleave", () => {
			card.style.transform =
				"perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
		});
	});

	// ——————————————————————————————————————————————
	//  ARENAS STICKY SCROLL INTERACTION with SHADERS
	// ——————————————————————————————————————————————
	const arenasData = [
		{
			title: "Music & Stages",
			description:
				"Concerts, tours, audio-reactive scenography. Music becomes light.",
			icon: `<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
		},
		{
			title: "Film & Screens",
			description:
				"Virtual production, previz, promotional art. Cinema meets machine vision.",
			icon: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>`,
		},
		{
			title: "Brands & Marketing",
			description:
				"Pop-ups, AI avatars, interactive launchpads. Campaigns as experiences.",
			icon: `<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
		},
		{
			title: "Culture & Festivals",
			description:
				"Museums, festivals, participatory installations. Creating living archives.",
			icon: `<svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
		},
		{
			title: "Tech & Expos",
			description:
				"Corporate storytelling, keynote scenography, and immersive innovation showcases.",
			icon: `<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
		},
		{
			title: "Luxury & Retail",
			description:
				"Generative walls, XR try-ons, and experiential retail. Art as ambience.",
			icon: `<svg viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`,
		},
	];

	const parent = document.getElementById("arenas-sticky-parent");
	if (parent && window.innerWidth > 768) {
		const textContainer = parent.querySelector(".arenas-left");
		const visualCanvas = document.getElementById("arena-visual-canvas");

		let arenaPrograms = [];
		let currentArena = 0;
		let arenaRAF;

		try {
			const gl = visualCanvas.getContext("webgl", { antialias: true });
			if (!gl) throw new Error("WebGL not supported for Arenas");

			const vertexShaderSource = `attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
			const fragmentShaders = [
				// 0: Music (Waveform)
				`precision mediump float; uniform float t; uniform vec2 r; void main() { vec2 uv = (gl_FragCoord.xy-.5*r.xy)/r.y; float c=0.; for(float i=1.;i<5.;i++){ float s=sin(uv.x*20.*i-t*i*.5)*.1/i; c+=step(.01,abs(uv.y-s)); } gl_FragColor=vec4(c*.2,c*.8,c,1.); }`,
				// 1: Film (Grain)
				`precision mediump float; uniform float t; uniform vec2 r; float rand(vec2 c){ return fract(sin(dot(c.xy,vec2(12.9898,78.233)))*43758.5453); } void main() { vec2 uv=gl_FragCoord.xy/r.xy; float g=rand(uv+t)*.2; float d=distance(uv,vec2(.5)); gl_FragColor=vec4(vec3(g),1.)+vec4(0.,0.,0.,smoothstep(.7,.4,d)); }`,
				// 2: Brands (Particles)
				`precision mediump float; uniform float t; uniform vec2 r; vec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));} void main() { vec2 uv=(gl_FragCoord.xy*2.-r.xy)/r.y; vec3 col=vec3(0); for(float i=0.;i<5.;i++){ float ti=t*.2+i*1.5; vec2 p=vec2(sin(ti),cos(ti*.8)); float d=length(uv-p); col+=.005/(d*d); } gl_FragColor=vec4(pal(t*.1,vec3(.5),vec3(.5),vec3(1.),vec3(.0,.1,.2))+col,1.); }`,
				// 3: Culture (Organic)
				`precision mediump float; uniform float t; uniform vec2 r; void main() { vec2 uv=(gl_FragCoord.xy-.5*r.xy)/r.y; float v=0.; for(float i=0.;i<4.;i++){ uv=abs(uv)/dot(uv,uv)-.8+sin(t*.2+i)*.1; v+=length(uv); } gl_FragColor=vec4(vec3(v*.2,v*.1,v*.3),1.); }`,
				// 4: Tech (Grid)
				`precision mediump float; uniform float t; uniform vec2 r; void main() { vec2 uv=(gl_FragCoord.xy-.5*r.xy)/r.y; uv*=mat2(cos(t*.1),-sin(t*.1),sin(t*.1),cos(t*.1)); vec3 c=vec3(0); vec2 g=fract(uv*10.); float d=min(g.x,g.y); c+=step(d,.05); gl_FragColor=vec4(c*.2,c,c*.8,1.); }`,
				// 5: Luxury (Sparkle)
				`precision mediump float; uniform float t; uniform vec2 r; float rand(vec2 c){ return fract(sin(dot(c.xy,vec2(12.9898,78.233)))*43758.5453); } void main() { vec2 uv=gl_FragCoord.xy/r.xy; float n=rand(uv+sin(t)); float s=step(.998,n); gl_FragColor=vec4(vec3(s),1.)+vec4(uv.x,uv.y,1.,0.)*.1; }`,
			];

			const createProgram = (fsSource) => {
				const vs = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(vs, vertexShaderSource);
				gl.compileShader(vs);
				const fs = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(fs, fsSource);
				gl.compileShader(fs);
				const prog = gl.createProgram();
				gl.attachShader(prog, vs);
				gl.attachShader(prog, fs);
				gl.linkProgram(prog);
				return prog;
			};

			arenaPrograms = fragmentShaders.map((fs) => createProgram(fs));
			const posBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
				gl.STATIC_DRAW
			);
			const posAttr = gl.getAttribLocation(arenaPrograms[0], "a_position");
			gl.enableVertexAttribArray(posAttr);
			gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

			const renderArenas = (time) => {
				time *= 0.001;
				visualCanvas.width = visualCanvas.clientWidth;
				visualCanvas.height = visualCanvas.clientHeight;
				gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

				const prog = arenaPrograms[currentArena];
				gl.useProgram(prog);
				gl.uniform2f(
					gl.getUniformLocation(prog, "r"),
					gl.canvas.width,
					gl.canvas.height
				);
				gl.uniform1f(gl.getUniformLocation(prog, "t"), time);

				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
				arenaRAF = requestAnimationFrame(renderArenas);
			};
			arenaRAF = requestAnimationFrame(renderArenas);

			// Populate HTML and set up observers
			arenasData.forEach((arena, index) => {
				const textItem = document.createElement("div");
				textItem.className = "arena-text-item";
				textItem.dataset.index = index;
				textItem.innerHTML = `<div class="icon" aria-hidden="true">${arena.icon}</div><div><h3>${arena.title}</h3><p>${arena.description}</p></div>`;
				textContainer.appendChild(textItem);

				const trigger = document.createElement("div");
				trigger.className = "arena-scroll-trigger";
				trigger.dataset.index = index;
				parent.appendChild(trigger);
			});

			const textItems = parent.querySelectorAll(".arena-text-item");
			const scrollTriggers = parent.querySelectorAll(".arena-scroll-trigger");

			const arenaObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const index = parseInt(entry.target.dataset.index);
							currentArena = index;
							textItems.forEach((item) => item.classList.remove("active"));
							textItems[index].classList.add("active");
						}
					});
				},
				{ threshold: 0.5 }
			);

			scrollTriggers.forEach((trigger) => arenaObserver.observe(trigger));
			if (textItems.length > 0) textItems[0].classList.add("active");
		} catch (error) {
			console.error("Arenas WebGL failed:", error);
			if (visualCanvas) visualCanvas.style.display = "none";
		}
	}

	// ——————————————————————————————————————————————
	//  GLITCH ANIMATION SCRIPT
	// ——————————————————————————————————————————————
	const glitchEl = document.querySelector(".glitch .text");
	if (glitchEl) {
		const originalText = glitchEl.textContent;
		const alphabet = "█░▒▓/\\|<>_=-+*#0123456789";
		let frame = 0;
		const totalFrames = 40;
		const interval = setInterval(() => {
			frame++;
			const progress = frame / totalFrames;
			glitchEl.textContent = originalText
				.split("")
				.map((char, i) => {
					if (char === " " || char === "\n") return char;
					return Math.random() < progress
						? originalText[i]
						: alphabet[Math.floor(Math.random() * alphabet.length)];
				})
				.join("");
			if (frame >= totalFrames) {
				clearInterval(interval);
				glitchEl.textContent = originalText;
			}
		}, 40);
	}

	// ——————————————————————————————————————————————
	//  GLITCH SHADERS - Animated background effects
	// ——————————————————————————————————————————————

	// Glitch Shader 1 - Digital distortion
	const glitchCanvas1 = document.getElementById("glitch-canvas-1");
	if (glitchCanvas1) {
		try {
			const gl1 = glitchCanvas1.getContext("webgl", { antialias: false });
			if (!gl1) throw new Error("WebGL not supported");

			const vertexShader1 = `attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
			const fragmentShader1 = `
				precision mediump float;
				uniform vec2 u_resolution;
				uniform float u_time;
				
				float random(vec2 st) {
					return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
				}
				
				void main() {
					vec2 st = gl_FragCoord.xy/u_resolution.xy;
					float time = u_time * 2.0;
					
					// Digital scan lines
					float scanLine = sin(st.y * 800.0 + time * 10.0) * 0.04;
					
					// Random glitch blocks
					vec2 blockSt = floor(st * 20.0) / 20.0;
					float noise = random(blockSt + floor(time * 4.0));
					
					// Color channels shift
					float r = noise * step(0.95, noise) * 0.5;
					float g = scanLine * 0.3;
					float b = (noise * scanLine) * 0.8;
					
					vec3 color = vec3(r, g, b);
					float alpha = (r + g + b) * 0.4;
					
					gl_FragColor = vec4(color, alpha);
				}`;

			const program1 = createGlitchProgram(gl1, vertexShader1, fragmentShader1);
			setupGlitchCanvas(gl1, program1, glitchCanvas1, 1);
		} catch (error) {
			console.warn("Glitch Canvas 1 WebGL failed:", error);
		}
	}

	// Glitch Shader 2 - Data corruption effect
	const glitchCanvas2 = document.getElementById("glitch-canvas-2");
	if (glitchCanvas2) {
		try {
			const gl2 = glitchCanvas2.getContext("webgl", { antialias: false });
			if (!gl2) throw new Error("WebGL not supported");

			const vertexShader2 = `attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
			const fragmentShader2 = `
				precision mediump float;
				uniform vec2 u_resolution;
				uniform float u_time;
				
				float random(vec2 st) {
					return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
				}
				
				void main() {
					vec2 st = gl_FragCoord.xy/u_resolution.xy;
					float time = u_time * 1.5;
					
					// Data corruption bars
					float bars = step(0.98, random(vec2(floor(st.y * 50.0), floor(time * 3.0))));
					
					// Horizontal glitch lines
					float glitchLine = step(0.994, random(vec2(0.0, floor(st.y * 200.0 + time * 20.0))));
					
					// RGB split effect
					vec2 offset = vec2(glitchLine * 0.02, 0.0);
					float r = bars * 0.8;
					float g = glitchLine * 0.4;
					float b = (bars * glitchLine) * 1.0;
					
					vec3 color = vec3(r, g, b);
					float alpha = (bars + glitchLine) * 0.3;
					
					gl_FragColor = vec4(color, alpha);
				}`;

			const program2 = createGlitchProgram(gl2, vertexShader2, fragmentShader2);
			setupGlitchCanvas(gl2, program2, glitchCanvas2, 2);
		} catch (error) {
			console.warn("Glitch Canvas 2 WebGL failed:", error);
		}
	}

	// Helper functions for glitch shaders
	function createGlitchProgram(gl, vertexSource, fragmentSource) {
		const createShader = (type, source) => {
			const shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			return shader;
		};

		const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
		const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		gl.useProgram(program);

		// Setup geometry
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
			gl.STATIC_DRAW
		);

		const positionLocation = gl.getAttribLocation(program, "a_position");
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		return {
			program,
			uniforms: {
				resolution: gl.getUniformLocation(program, "u_resolution"),
				time: gl.getUniformLocation(program, "u_time"),
			},
		};
	}

	function setupGlitchCanvas(gl, programInfo, canvas, id) {
		let animationId;

		function render(time) {
			time *= 0.001;

			// Resize canvas to match element size
			if (
				canvas.width !== canvas.clientWidth ||
				canvas.height !== canvas.clientHeight
			) {
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
				gl.viewport(0, 0, canvas.width, canvas.height);
			}

			// Set uniforms and draw
			gl.uniform2f(
				programInfo.uniforms.resolution,
				canvas.width,
				canvas.height
			);
			gl.uniform1f(programInfo.uniforms.time, time);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

			animationId = requestAnimationFrame(render);
		}

		// Start animation after glitch text animation completes
		setTimeout(
			() => {
				render(0);
			},
			id === 1 ? 800 : 1000
		);

		// Cleanup function
		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}
});

// Remove any accidental canvases inside CTA elements/buttons (preserve core canvases)
(function removeCTAOverlays() {
	const preserveIds = new Set([
		"aether",
		"glitch-canvas-1",
		"glitch-canvas-2",
		"philosophy-canvas",
		"arena-visual-canvas",
		"glitch-canvas-1",
		"glitch-canvas-2",
	]);

	const selectors = [".cta-nav", ".cta-big", "button", "a"];
	selectors.forEach((sel) => {
		document.querySelectorAll(sel).forEach((el) => {
			el.querySelectorAll("canvas").forEach((c) => {
				if (!c.id || !preserveIds.has(c.id)) {
					c.remove();
				}
			});
		});
	});
})();
