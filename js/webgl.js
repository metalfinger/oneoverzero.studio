// AETHER CANVAS — mystical flow-field particles
function initAetherCanvas() {
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
}

// PHILOSOPHY CANVAS - Interactive Noise Shader
function initPhilosophyCanvas() {
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
}

// Glitch Shader 1 - Digital distortion
function initGlitchCanvas1() {
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
}

// Glitch Shader 2 - Data corruption effect
function initGlitchCanvas2() {
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
}

// Initialize all WebGL components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	initAetherCanvas();
	initPhilosophyCanvas();
	initGlitchCanvas1();
	initGlitchCanvas2();
});