Write-Host "Checking Cyber Risk Dashboard Services..." -ForegroundColor Cyan
Write-Host ""

# Check Backend (Port 5000)
Write-Host "Checking Backend Server (Port 5000)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/risk/health" -Method GET -UseBasicParsing -TimeoutSec 2
    Write-Host " ✓ Running" -ForegroundColor Green
} catch {
    Write-Host " ✗ Not Running" -ForegroundColor Red
    Write-Host "  Please start the backend server: cd backend && npm start" -ForegroundColor Yellow
}

# Check Python Service (Port 5001)
Write-Host "Checking Python Risk Service (Port 5001)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET -UseBasicParsing -TimeoutSec 2
    Write-Host " ✓ Running" -ForegroundColor Green
} catch {
    Write-Host " ✗ Not Running" -ForegroundColor Red
    Write-Host "  Please start the Python service: cd backend/python_service && python app.py" -ForegroundColor Yellow
}

# Check Frontend (Port 5173)
Write-Host "Checking Frontend (Port 5173)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -UseBasicParsing -TimeoutSec 2
    Write-Host " ✓ Running" -ForegroundColor Green
} catch {
    Write-Host " ✗ Not Running" -ForegroundColor Red
    Write-Host "  Please start the frontend: npm run dev" -ForegroundColor Yellow
}

# Check MongoDB (Port 27017)
Write-Host "Checking MongoDB (Port 27017)..." -NoNewline
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect("localhost", 27017)
    $tcpClient.Close()
    Write-Host " ✓ Running" -ForegroundColor Green
} catch {
    Write-Host " ✗ Not Running" -ForegroundColor Red
    Write-Host "  Please start MongoDB: mongod" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Service check complete!" -ForegroundColor Cyan 
 