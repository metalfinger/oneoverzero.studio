# Video Export Instructions

This directory contains standalone HTML/JS files for each component you want to export as video. All exports now automatically fit the browser window size for flexible recording at any resolution:

1. **Hero Background** (`hero_export.html`/`hero_export.js`) - The particle animation from the hero section
2. **Button Gradient** (`button_export.html`) - The animated gradient background used in buttons
3. **Philosophy Shader** (`philosophy_export.html`/`philosophy_export.js`) - The fragment shader from the philosophy section
4. **Floating Dots** (`floating_dots_export.html`) - The floating dots animation from the WHO section
5. **Glitch Text** (`glitch_text_export.html`) - The complete hero section experience with the particle background and "Stories written in code. Emotions carved from pixels." text animation (plays once)

## Recording Instructions

To record these as videos, you can use a screen recording tool or browser extension. Here are a few options:

### Option 1: Browser Extension (Recommended)
1. Install a screen recording extension like "Screencastify" or "Loom"
2. Open each HTML file in your browser
3. Resize your browser window to your desired recording resolution
4. Start recording and let it run for 10-15 seconds to capture the looping animation
5. Save the video

### Option 2: OBS Studio (Free Software)
1. Download and install OBS Studio
2. Add a "Browser" source
3. Point it to the HTML file (e.g., `file:///C:/Users/Admin/Documents/code/oneoverzero.studio/video_exports/hero_export.html`)
4. Set the browser source resolution to your desired recording size
5. Start recording

### Option 3: Command Line with FFmpeg
If you have FFmpeg installed, you can record directly:

```bash
# For the hero background (record at 1920x1080)
ffmpeg -f gdigrab -framerate 60 -video_size 1920x1080 -i http://localhost:8000/video_exports/hero_export.html -t 15 -c:v libx264 -pix_fmt yuv420p hero_background.mp4

# For the button gradient (record at 1920x1080)
ffmpeg -f gdigrab -framerate 60 -video_size 1920x1080 -i http://localhost:8000/video_exports/button_export.html -t 15 -c:v libx264 -pix_fmt yuv420p button_gradient.mp4

# For the philosophy shader (record at 1920x1080)
ffmpeg -f gdigrab -framerate 60 -video_size 1920x1080 -i http://localhost:8000/video_exports/philosophy_export.html -t 15 -c:v libx264 -pix_fmt yuv420p philosophy_shader.mp4

# For the floating dots background (record at 1920x1080)
ffmpeg -f gdigrab -framerate 60 -video_size 1920x1080 -i http://localhost:8000/video_exports/floating_dots_export.html -t 15 -c:v libx264 -pix_fmt yuv420p floating_dots.mp4

# For the glitch text animation (record at 1920x1080)
ffmpeg -f gdigrab -framerate 60 -video_size 1920x1080 -i http://localhost:8000/video_exports/glitch_text_export.html -t 15 -c:v libx264 -pix_fmt yuv420p glitch_text.mp4
```

## Serving Files Locally

To use the localhost URLs above, you'll need to serve the files locally:

```bash
# From the oneoverzero.studio directory
python -m http.server 8000
# or
npx serve
```

Then access the files at:
- http://localhost:8000/video_exports/hero_export.html
- http://localhost:8000/video_exports/button_export.html
- http://localhost:8000/video_exports/philosophy_export.html
- http://localhost:8000/video_exports/floating_dots_export.html
- http://localhost:8000/video_exports/glitch_text_export.html