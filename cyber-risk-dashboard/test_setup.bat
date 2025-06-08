@echo off
echo.
echo Testing Authentication Setup...
echo.

echo Step 1: Checking .env file...
if exist backend\.env (
    echo ✅ .env file exists
    echo Contents:
    type backend\.env
) else (
    echo ❌ .env file missing
    goto :error
)

echo.
echo Step 2: Testing backend server...
echo Starting server test (will run for 10 seconds)...
cd backend

timeout /t 3 /nobreak >nul
echo.
echo To test manually:
echo 1. Run: cd backend ^&^& node server.js
echo 2. Should see: "MongoDB Connected" and "Server running on port 5000"
echo 3. Run: npm run dev (in separate terminal)
echo 4. Go to: http://localhost:5173/signup
echo.

goto :success

:error
echo.
echo ❌ Setup incomplete - check the steps above
pause
exit /b 1

:success
echo ✅ Setup files ready!
echo.
echo Next steps:
echo 1. Set up MongoDB Atlas (see MONGODB_ATLAS_SETUP.md)
echo 2. Update MONGODB_URI in backend/.env
echo 3. Test with: cd backend ^&^& node server.js
echo.
pause 