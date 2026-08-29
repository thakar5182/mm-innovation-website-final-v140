@echo off
setlocal
title M&M Innovation Website FINAL V1.4.0
cd /d "%~dp0"

set "PY_CMD="
where py >nul 2>nul && set "PY_CMD=py"
if not defined PY_CMD where python >nul 2>nul && set "PY_CMD=python"

if not defined PY_CMD (
  echo.
  echo Python was not found. Opening the website directly.
  echo For full Admin and enquiry features, install Python and run this file again.
  start "" "%~dp0index.html"
  pause
  exit /b 0
)

set "PORT=8080"
for /f %%P in ('powershell -NoProfile -Command "$p=8080; while(Get-NetTCPConnection -State Listen -LocalPort $p -ErrorAction SilentlyContinue){$p++}; Write-Output $p"') do set "PORT=%%P"

echo.
echo  M&M Innovation Website FINAL V1.4.0
echo  Project folder: %CD%
echo  Website URL: http://localhost:%PORT%
echo.
echo  Keep this window open while using the website.
echo  Press Ctrl+C to stop the server.
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:%PORT%'"
%PY_CMD% -m http.server %PORT% --bind 127.0.0.1

endlocal
