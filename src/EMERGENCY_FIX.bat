@echo off
echo ========================================
echo  EMERGENCY FIX FOR ROUTER ERROR
echo ========================================
echo.

REM Step 1: Clean installation
echo Step 1: Cleaning node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json
echo Done!
echo.

REM Step 2: Clean build cache
echo Step 2: Cleaning build cache...
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist
echo Done!
echo.

REM Step 3: Install dependencies
echo Step 3: Installing dependencies...
call npm install
echo Done!
echo.

REM Step 4: Install React Router
echo Step 4: Installing React Router...
call npm install react-router-dom@6.27.0
echo Done!
echo.

echo ========================================
echo  SETUP COMPLETE!
echo ========================================
echo.
echo Next Steps:
echo 1. Start backend: cd server ^&^& npm start
echo 2. Start frontend (new terminal): npm run dev
echo 3. Open browser: http://localhost:5173
echo 4. Press F12 and run:
echo    localStorage.clear(); sessionStorage.clear(); location.reload();
echo 5. Hard refresh: Ctrl+Shift+R
echo.
echo If still seeing router error:
echo - Open in INCOGNITO/PRIVATE window
echo - It's browser cache!
echo.
pause
