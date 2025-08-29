// PHILOSOPHY CANVAS - Interactive Noise Shader (Modified for export)
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
            
            // Set mouse to center
            let mousePos = { x: 0.5, y: 0.5 };

            // Set canvas size
            philosophyCanvas.width = 1920;
            philosophyCanvas.height = 1920;
            gl.viewport(0, 0, 1920, 1920);

            const renderPhilosophy = (time) => {
                time *= 0.001;
                
                gl.uniform2f(
                    resolutionUniformLocation,
                    1920,
                    1920
                );
                gl.uniform1f(timeUniformLocation, time);
                gl.uniform2f(mouseUniformLocation, mousePos.x, 1.0 - mousePos.y);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                philosophyRAF = requestAnimationFrame(renderPhilosophy);
            };

            philosophyRAF = requestAnimationFrame(renderPhilosophy);
            
        } catch (error) {
            console.error("WebGL shader for philosophy section failed:", error);
            if (philosophyCanvas) philosophyCanvas.style.display = "none";
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initPhilosophyCanvas();
});