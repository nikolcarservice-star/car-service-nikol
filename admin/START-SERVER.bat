@echo off
cd /d "%~dp0.."
echo Starting server in: %CD%
echo.
echo Open in browser: http://127.0.0.1:8080/admin/
echo Press Ctrl+C to stop.
echo.
python -m http.server 8080
if errorlevel 1 (
  echo.
  echo Python not found. Install from: https://www.python.org/ or Microsoft Store
  pause
)
