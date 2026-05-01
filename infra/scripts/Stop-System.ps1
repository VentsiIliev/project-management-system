$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$backendStop = Join-Path $repoRoot "infra\scripts\Stop-Backend.ps1"
$frontendStop = Join-Path $repoRoot "infra\scripts\Stop-Frontend.ps1"

& $backendStop
& $frontendStop

Write-Host "Tracked backend and frontend launcher processes have been stopped."
