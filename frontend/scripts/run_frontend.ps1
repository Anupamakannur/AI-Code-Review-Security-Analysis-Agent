Write-Host "Starting frontend dev server..."
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm not found in PATH. Please install Node.js and npm first." -ForegroundColor Yellow
    exit 1
}
cd ..\frontend
npm install
npm run dev
