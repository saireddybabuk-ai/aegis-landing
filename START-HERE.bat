@echo off
REM ===================================================================
REM  Aegis Landing Page - local dev launcher
REM
REM  Double-click this file. It forces the working directory to its own
REM  location, so "Missing script: dev" caused by being in the wrong
REM  folder cannot happen.
REM ===================================================================

cd /d "%~dp0"

echo.
echo  ============================================================
echo   AEGIS LANDING PAGE
echo  ============================================================
echo.
echo   Folder: %CD%
echo.

REM --- Is Node installed? ---
where node >nul 2>nul
if errorlevel 1 (
  echo   [X] Node.js is not installed, or not on your PATH.
  echo.
  echo       Download the LTS version from https://nodejs.org
  echo       then close this window and run it again.
  echo.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do echo   Node:   %%v
for /f "tokens=*" %%v in ('npm -v') do echo   npm:    %%v
echo.

REM --- Is package.json here at all? ---
if not exist "package.json" (
  echo   [X] No package.json in this folder.
  echo.
  echo       This file must sit directly beside package.json,
  echo       aegis.html, vite.config.js and the src folder.
  echo.
  echo       Folder currently contains:
  dir /b
  echo.
  pause
  exit /b 1
)

REM --- Is it the RIGHT package.json? ---
findstr /C:"aegis-landing" package.json >nul
if errorlevel 1 (
  echo   [X] Wrong project.
  echo.
  echo       A package.json is here, but it belongs to a different
  echo       project - it has no "dev" script, which is the error
  echo       you were seeing.
  echo.
  echo       Move the Aegis files into their own empty folder,
  echo       for example C:\Users\%USERNAME%\aegis-landing
  echo.
  pause
  exit /b 1
)

echo   [OK] Aegis project found.
echo.

REM --- Install once ---
if not exist "node_modules" (
  echo   Installing dependencies. First run takes a minute...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo   [X] Install failed. Scroll up for the reason.
    pause
    exit /b 1
  )
  echo.
)

echo   Starting the dev server...
echo   Your browser opens at http://localhost:5173
echo   Press Ctrl+C in this window to stop.
echo.

call npm run dev

pause
