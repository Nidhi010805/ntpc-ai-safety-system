# Starts the backend so the model team's worker can connect to it.
# Run from anywhere:  powershell -ExecutionPolicy Bypass -File scripts\start_backend.ps1
#
# The worker token is created once and saved in backend\.worker_token
# (git-ignored), so it stays the same every time you restart.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$tokenFile = Join-Path $root "backend\.worker_token"

if (-not (Test-Path $tokenFile)) {
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $token = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
    Set-Content -Path $tokenFile -Value $token -NoNewline
    Write-Host "Created a new worker token." -ForegroundColor Green
}

$env:WORKER_API_TOKEN = (Get-Content $tokenFile -Raw).Trim()

Write-Host ""
Write-Host "WORKER TOKEN (give this to the model team, keep it private):" -ForegroundColor Yellow
Write-Host $env:WORKER_API_TOKEN
Write-Host ""

Set-Location (Join-Path $root "backend")
uvicorn app:app --host 0.0.0.0 --port 8000