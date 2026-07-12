param(
    [string]$VenvPath = ".venv",
    [string]$Python = "python"
)

Write-Host "Setting up backend environment..."

# Create virtual environment
& $Python -m venv $VenvPath

# Activate venv for this script session
. "$PWD\$VenvPath\Scripts\Activate.ps1"

Write-Host "Installing Python dependencies..."
pip install --upgrade pip
pip install -r ..\requirements.txt

Write-Host "Running backend (uvicorn)..."
cd ..
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
