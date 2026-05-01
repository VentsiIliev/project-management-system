$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$pidFile = Join-Path $repoRoot ".run\backend-launcher.pid"

if (-not (Test-Path $pidFile)) {
    Write-Host "No tracked backend launcher process was found."
    exit 0
}

$pidValue = (Get-Content $pidFile | Select-Object -First 1).Trim()

if (-not $pidValue) {
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    Write-Host "Backend PID file was empty and has been cleared."
    exit 0
}

$process = Get-Process -Id ([int]$pidValue) -ErrorAction SilentlyContinue
if ($null -eq $process) {
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    Write-Host "Backend launcher process is no longer running."
    exit 0
}

Stop-Process -Id $process.Id -Force
Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
Write-Host "Stopped backend launcher process $($process.Id)."
