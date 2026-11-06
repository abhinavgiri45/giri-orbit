# ============================================================================
# GIRI ORBIT — MASTER AUTO-UPDATE & MULTI-PLATFORM RELEASE BUILDER
# By GIRI Corporation (A Subsidiary of Giri Group)
# One-click script to package & distribute updates across Web, Windows, & Android
# ============================================================================

$ErrorActionPreference = "Stop"
$rootDir = $PSScriptRoot
$downloadsDir = Join-Path $rootDir "downloads"
$versionJsonPath = Join-Path $rootDir "version.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Giri Orbit - Universal Multi-Platform Release Builder   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Update Version and Build Timestamp
Write-Host "`n[1/5] Updating version.json metadata..." -ForegroundColor Yellow
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$versionContent = Get-Content $versionJsonPath -Raw
$versionContent = [System.Text.RegularExpressions.Regex]::Replace($versionContent, '"buildTimestamp":\s*\d+', "`"buildTimestamp`": $timestamp")
[System.IO.File]::WriteAllText($versionJsonPath, $versionContent, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "  Updated build timestamp to: $timestamp" -ForegroundColor Green

# 2. Package OTA Assets Bundle (.zip)
Write-Host "`n[2/5] Packaging Over-The-Air assets bundle (assets-bundle.zip)..." -ForegroundColor Yellow
$outZip = Join-Path $downloadsDir "assets-bundle.zip"
$pyCode = @"
import zipfile, os

base_dir = r'$rootDir'
out_zip = r'$outZip'
include_items = ['index.html', 'version.json', 'manifest.json', 'sw.js', 'css', 'js', 'assets']

with zipfile.ZipFile(out_zip, 'w', compression=zipfile.ZIP_DEFLATED) as z:
    for item in include_items:
        full_item = os.path.join(base_dir, item)
        if os.path.isfile(full_item):
            z.write(full_item, item)
        elif os.path.isdir(full_item):
            for root, dirs, files in os.walk(full_item):
                for f in files:
                    fp = os.path.join(root, f)
                    rel = os.path.relpath(fp, base_dir).replace('\\\\', '/')
                    z.write(fp, rel)
print('Assets bundle successfully created: ' + str(os.path.getsize(out_zip)) + ' bytes')
"@
python.exe -c $pyCode

# 3. Rebuild Dedicated Android APK
Write-Host "`n[3/5] Rebuilding dedicated Android APK..." -ForegroundColor Yellow
$androidDir = "C:\Users\abhin\OneDrive\Desktop\giri-orbit-android"
if (Test-Path $androidDir) {
    Copy-Item -Path (Join-Path $rootDir "index.html") -Destination (Join-Path $androidDir "app\src\main\assets\www\index.html") -Force
    Copy-Item -Path (Join-Path $rootDir "sw.js") -Destination (Join-Path $androidDir "app\src\main\assets\www\sw.js") -Force
    Copy-Item -Path (Join-Path $rootDir "version.json") -Destination (Join-Path $androidDir "app\src\main\assets\www\version.json") -Force
    Copy-Item -Path (Join-Path $rootDir "manifest.json") -Destination (Join-Path $androidDir "app\src\main\assets\www\manifest.json") -Force
    Copy-Item -Path (Join-Path $rootDir "js\*") -Destination (Join-Path $androidDir "app\src\main\assets\www\js") -Recurse -Force
    Copy-Item -Path (Join-Path $rootDir "css\*") -Destination (Join-Path $androidDir "app\src\main\assets\www\css") -Recurse -Force
    powershell.exe -ExecutionPolicy Bypass -File (Join-Path $androidDir "build_apk.ps1")
}

# 4. Rebuild Dedicated Windows Desktop Apps
Write-Host "`n[4/5] Rebuilding dedicated Windows Desktop setups (x64, x86, ARM64)..." -ForegroundColor Yellow
$windowsDir = "C:\Users\abhin\OneDrive\Desktop\giri-orbit-windows"
if (Test-Path $windowsDir) {
    powershell.exe -ExecutionPolicy Bypass -File (Join-Path $windowsDir "build.ps1")
}

# 5. Git Commit & Push
Write-Host "`n[5/5] Checking repository synchronization..." -ForegroundColor Yellow
cd $rootDir
git status -s

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  SUCCESS! All applications updated & ready for release!  " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Get-ChildItem $downloadsDir | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
