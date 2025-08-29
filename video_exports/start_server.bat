@echo off
echo Starting local server for video exports...
echo.
echo Open your browser and navigate to:
echo http://localhost:8000/video_exports/hero_export.html
echo http://localhost:8000/video_exports/button_export.html
echo http://localhost:8000/video_exports/philosophy_export.html
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000