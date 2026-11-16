# Makes your local backend reachable from the internet so the model team's
# worker (on their laptop or Kaggle) can connect.
# Run in a SECOND terminal, while start_backend.ps1 is running.

if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    Write-Host "cloudflared is not installed. Install it with:" -ForegroundColor Yellow
    Write-Host "    winget install Cloudflare.cloudflared"
    Write-Host "Then close and reopen this terminal and run this script again."
    exit 1
}

Write-Host "Look for the line with https://xxxx.trycloudflare.com below." -ForegroundColor Yellow
Write-Host "Send the team:  <that URL>/api/fire-smoke   +   the worker token" -ForegroundColor Yellow
Write-Host "The URL changes every time you restart this tunnel." -ForegroundColor Yellow
Write-Host ""

cloudflared tunnel --url http://localhost:8001