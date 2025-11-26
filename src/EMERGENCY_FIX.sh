#!/bin/bash

echo "🚨 EMERGENCY FIX FOR ROUTER ERROR 🚨"
echo "===================================="
echo ""

# Step 1: Kill existing processes
echo "Step 1: Stopping all processes..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
echo "✅ Processes stopped"
echo ""

# Step 2: Clean install
echo "Step 2: Clean installation..."
rm -rf node_modules package-lock.json
echo "✅ Cleaned node_modules"
echo ""

# Step 3: Install dependencies
echo "Step 3: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 4: Install React Router specifically
echo "Step 4: Installing React Router..."
npm install react-router-dom@6.27.0
echo "✅ React Router installed"
echo ""

# Step 5: Clean build cache
echo "Step 5: Cleaning build cache..."
rm -rf .vite dist
echo "✅ Build cache cleaned"
echo ""

# Step 6: Start backend
echo "Step 6: Starting backend..."
cd server
npm install 2>/dev/null || true
npm start &
BACKEND_PID=$!
cd ..
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
sleep 3

# Step 7: Start frontend
echo "Step 7: Starting frontend..."
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "===================================="
echo "✅ ALL DONE!"
echo ""
echo "📝 Next Steps:"
echo "1. Open browser: http://localhost:5173"
echo "2. Press F12 (DevTools)"
echo "3. Run in console:"
echo "   localStorage.clear(); sessionStorage.clear(); location.reload();"
echo "4. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
echo ""
echo "If you see router error:"
echo "- Open in INCOGNITO/PRIVATE window"
echo "- The error is likely browser cache!"
echo ""
echo "To stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
