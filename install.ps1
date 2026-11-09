# AgentPulse Universal Windows Installer
# Usage: irm https://raw.githubusercontent.com/<OWNER>/<REPO>/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

$Repo = "NomanRafique01/AgentPulse"
if ($env:AGENTPULSE_REPO) { $Repo = $env:AGENTPULSE_REPO }

$InstallDir = Join-Path $env:USERPROFILE ".agentpulse"
$BinDir = Join-Path $InstallDir "bin"
$ZipPath = Join-Path $env:TEMP "agentpulse-windows-x64.zip"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Installing AgentPulse (Signal System)   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Download Release
$ReleaseUrl = "https://github.com/$Repo/releases/latest/download/agentpulse-windows-x64.zip"
Write-Host "==> Downloading release package..." -ForegroundColor Yellow

$downloaded = $false
try {
    Invoke-WebRequest -Uri $ReleaseUrl -OutFile $ZipPath -UseBasicParsing
    $downloaded = $true
} catch {
    # If network download is unavailable (e.g. repo not yet published), check for local package
    $LocalDist = Join-Path (Get-Location) "dist\agentpulse-windows-x64.zip"
    if (Test-Path $LocalDist) {
        Write-Host "==> Using local distribution package: $LocalDist" -ForegroundColor Green
        Copy-Item $LocalDist $ZipPath -Force
        $downloaded = $true
    } else {
        Write-Error "Could not download AgentPulse release package from GitHub ($ReleaseUrl). Please verify repository URL or release asset name."
        exit 1
    }
}

# 2. Extract cleanly (silent install, no shortcuts)
Write-Host "==> Extracting to $InstallDir ..." -ForegroundColor Yellow
if (-not (Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

Expand-Archive -Path $ZipPath -DestinationPath $InstallDir -Force
Remove-Item $ZipPath -Force -ErrorAction SilentlyContinue

# 3. Add to User PATH silently (No shortcuts, no desktop clutter)
Write-Host "==> Adding $BinDir to User PATH ..." -ForegroundColor Yellow
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($null -eq $UserPath) { $UserPath = "" }
$Parts = $UserPath -split ";" | Where-Object { $_ -ne "" }

if ($Parts -notcontains $BinDir) {
    $NewPath = (($UserPath.TrimEnd(";")) + ";" + $BinDir).TrimStart(";")
    [Environment]::SetEnvironmentVariable("Path", $NewPath, "User")
    $env:PATH = "$BinDir;$env:PATH"
    Write-Host "==> User PATH updated successfully." -ForegroundColor Green
} else {
    Write-Host "==> User PATH already configured." -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  AgentPulse installed successfully!                        " -ForegroundColor Green
Write-Host "  Location: $InstallDir                                     " -ForegroundColor Green
Write-Host "  Zero desktop clutter - pure background command system.    " -ForegroundColor Green
Write-Host "  In any project folder, run:                               " -ForegroundColor Green
Write-Host "    agentpulse init                                         " -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green

