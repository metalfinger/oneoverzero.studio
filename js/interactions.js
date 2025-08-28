// CARD TILT (3D hover)
document.addEventListener("DOMContentLoaded", () => {
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