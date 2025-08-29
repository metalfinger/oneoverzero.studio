// AETHER CANVAS — mystical flow-field particles (Modified for export)
function initAetherCanvas() {
    const heroCanvas = document.getElementById("aether");
    if (heroCanvas) {
        const heroCtx = heroCanvas.getContext("2d");
        let w, h, dpr = 1;
        const particles = [];
        const MAX = 1200;
        let t = 0;
        let raf;

        function resizeHeroCanvas() {
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

        function loop() {
            fadeHeroCanvas();
            t += 0.6;

            for (const p of particles) p.step();
            raf = requestAnimationFrame(loop);
        }

        function startAether() {
            cancelAnimationFrame(raf);
            loop();
        }

        // Initialize and handle resizing
        resizeHeroCanvas();
        initHeroCanvas();
        startAether();
        
        window.addEventListener("resize", () => {
            resizeHeroCanvas();
            initHeroCanvas();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initAetherCanvas();
});