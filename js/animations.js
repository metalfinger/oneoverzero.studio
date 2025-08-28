// Reveal Animation System
const io = new IntersectionObserver(
	(entries) => {
		entries.forEach((e) => {
			if (e.isIntersecting) {
				// Check if this is a card element for staggered animation
				if (e.target.classList.contains("card")) {
					// Get all cards in the same grid
					const parentGrid = e.target.closest(".grid");
					if (parentGrid) {
						const cards = Array.from(parentGrid.querySelectorAll(".card"));
						const index = cards.indexOf(e.target);
						// Add staggered delay (0.08s per card for a smoother flow)
						e.target.style.setProperty("--reveal-delay", index * 0.08);
					}
				}
				
				// Add the 'in' class to trigger animation
				e.target.classList.add("in");
				io.unobserve(e.target);
			}
		});
	},
	{ threshold: 0.1 }
);

// Initialize reveal animations
document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
});

// GLITCH ANIMATION SCRIPT
const glitchEl = document.querySelector(".glitch .text");
if (glitchEl) {
	const originalText = glitchEl.textContent;
	const alphabet = "█░▒▓/\\\\|<>_=-+*#0123456789";
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