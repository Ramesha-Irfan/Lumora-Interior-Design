@echo off
if /i "%1"=="-c" (
  del /f /q package-lock.json 2>nul
  del /f /q yarn.lock 2>nul
  echo %npm_config_user_agent% | findstr /b /i "pnpm/" >nul
  if errorlevel 1 (
    echo Use pnpm instead 1>&2
    exit /b 1
  )
  exit /b 0
)
echo sh: command not found
exit /b 127
