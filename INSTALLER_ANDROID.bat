@echo off
setlocal
cd /d "%~dp0"

echo ======================================
echo        RADIO REVEIL - INSTALLATION
echo ======================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe.
  echo Installe Node.js 22 LTS ou plus recent puis relance ce fichier.
  pause
  exit /b 1
)

echo [1/3] Installation des dependances...
call npm install
if errorlevel 1 goto :error

echo [2/3] Preparation du projet Android...
call npm run android:init
if errorlevel 1 goto :error

echo [3/3] Ouverture dans Android Studio...
call npx cap open android
if errorlevel 1 goto :error

exit /b 0

:error
echo.
echo Une erreur est survenue. Regarde le message affiche juste au-dessus.
pause
exit /b 1
