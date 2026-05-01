param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$frontendRoot = Join-Path $repoRoot "frontend"
$nodeModules = Join-Path $frontendRoot "node_modules"

if (-not $SkipInstall -and -not (Test-Path $nodeModules)) {
    Write-Host "Installing frontend dependencies..."
    Push-Location $frontendRoot
    try {
        npm install
    }
    finally {
        Pop-Location
    }
}

Write-Host "Starting frontend on http://localhost:5173 ..."
Push-Location $frontendRoot
try {
    npm run dev
}
finally {
    Pop-Location
}
