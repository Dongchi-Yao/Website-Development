@echo off
echo.
echo 🧪 Testing Backend Connection...
echo.

cd backend

echo Starting server for 10 seconds...
echo Look for "MongoDB Connected" and "Server running on port 5000"
echo.

timeout /t 2 /nobreak >nul

start /b node server.js

echo Waiting 10 seconds for connection test...
timeout /t 10 /nobreak >nul

echo.
echo ✅ If you saw "MongoDB Connected" - SUCCESS!
echo ❌ If you saw connection errors - check your Atlas setup
echo.
echo Press any key to stop the server and continue...
pause >nul

taskkill /f /im node.exe >nul 2>&1

echo.
echo Server stopped.
echo.
pause 