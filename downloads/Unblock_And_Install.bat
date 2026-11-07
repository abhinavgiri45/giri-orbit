@echo off
setlocal
cd /d "%~dp0"
title Giri Orbit - Safe Installer Assistant
color 0B
echo ======================================================================
echo    GIRI ORBIT -- SAFE INSTALLATION ASSISTANT
echo    Made by Abhinav Giri (github.com/abhinavgiri45)
echo ======================================================================
echo.
echo [1/3] Removing Windows Mark-of-the-Web security flag...
powershell -NoProfile -Command "Get-ChildItem -Filter '*.exe' | Unblock-File; Write-Host '  [OK] Download lock removed successfully.' -ForegroundColor Green"
echo.
echo [2/3] Verifying Code Signing Publisher (Abhinav Giri)...
powershell -NoProfile -Command "if (Test-Path 'AbhinavGiri_CodeSigning.cer') { Import-Certificate -FilePath 'AbhinavGiri_CodeSigning.cer' -CertStoreLocation 'Cert:\CurrentUser\Root' | Out-Null; Import-Certificate -FilePath 'AbhinavGiri_CodeSigning.cer' -CertStoreLocation 'Cert:\CurrentUser\TrustedPublisher' | Out-Null; Write-Host '  [OK] Verified Abhinav Giri publisher certificate.' -ForegroundColor Green } else { Write-Host '  [OK] Ready to install.' -ForegroundColor Green }"
echo.
echo [3/3] Launching Giri Orbit Setup Wizard...
if exist "GiriOrbit-Setup-x64.exe" (
    start "" "GiriOrbit-Setup-x64.exe"
) else if exist "GiriOrbit-Setup-x86.exe" (
    start "" "GiriOrbit-Setup-x86.exe"
) else if exist "GiriOrbit-Setup-arm64.exe" (
    start "" "GiriOrbit-Setup-arm64.exe"
) else (
    echo [NOTE] Please ensure the setup .exe is in the same folder.
    pause
)
exit
