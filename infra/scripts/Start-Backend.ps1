param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$backendRoot = Join-Path $repoRoot "backend"
$venvPython = Join-Path $backendRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $venvPython)) {
    Write-Host "Creating backend virtual environment with Python 3.12..."
    py -3.12 -m venv (Join-Path $backendRoot ".venv")
}

if (-not $SkipInstall) {
    Write-Host "Checking backend dependencies..."
    $djangoCheck = & $venvPython -c "import django" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Installing backend dependencies..."
        & $venvPython -m pip install --upgrade pip setuptools wheel
        & $venvPython -m pip install -e $backendRoot
    }
}

Write-Host "Running backend migrations..."
Push-Location $backendRoot
try {
    & $venvPython manage.py migrate
    Write-Host "Starting Django backend on http://localhost:8000 ..."
    & $venvPython manage.py runserver
}
finally {
    Pop-Location
}
