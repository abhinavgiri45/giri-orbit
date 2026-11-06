@echo off
cd /d "%~dp0"
echo ==========================================================
echo   Giri Orbit - One-Click Master Multi-Platform Updater
echo ==========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0update_all_apps.ps1"
pause
