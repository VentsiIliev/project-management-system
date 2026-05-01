param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$backendScript = Join-Path $repoRoot "infra\scripts\Start-Backend.ps1"
$frontendScript = Join-Path $repoRoot "infra\scripts\Start-Frontend.ps1"
$runRoot = Join-Path $repoRoot ".run"

if (-not (Test-Path $runRoot)) {
    New-Item -ItemType Directory -Path $runRoot | Out-Null
}

$backendArgs = @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", $backendScript
)

$frontendArgs = @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", $frontendScript
)

if ($SkipInstall) {
    $backendArgs += "-SkipInstall"
    $frontendArgs += "-SkipInstall"
}

Write-Host "Launching backend window..."
$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList $backendArgs -WorkingDirectory $repoRoot -WindowStyle Normal -PassThru
$backendProcess.Id | Set-Content (Join-Path $runRoot "backend-launcher.pid")

Start-Sleep -Seconds 2

Write-Host "Launching frontend window..."
$frontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList $frontendArgs -WorkingDirectory $repoRoot -WindowStyle Normal -PassThru
$frontendProcess.Id | Set-Content (Join-Path $runRoot "frontend-launcher.pid")

Write-Host ""
Write-Host "Backend and frontend launch commands were started in separate windows."
Write-Host "Backend:  http://localhost:8000/api/health/"
Write-Host "Frontend: http://localhost:5173"
