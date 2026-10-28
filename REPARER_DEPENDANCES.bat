@echo off
setlocal
cd /d "%~dp0"

echo ======================================
echo   RADIO REVEIL - REPARATION DEPENDANCES
echo ======================================
echo.
echo Cette operation remplace Angular 21 / TypeScript 5.9 par
echo Angular 20.1 / TypeScript 5.8, compatibles avec Ionic 8.
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe.
  echo Installe Node.js 22 LTS puis relance ce fichier.
  pause
  exit /b 1
)

echo [1/5] Suppression des anciennes dependances...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo [2/5] Installation des versions compatibles...
call npm install
if errorlevel 1 goto :error

echo [3/5] Verification du build Angular...
call npm run build
if errorlevel 1 goto :error

echo [4/5] Preparation / synchronisation Android...
call npm run android:init
if errorlevel 1 goto :error

echo [5/5] Ouverture dans Android Studio...
call npx cap open android
if errorlevel 1 goto :error

exit /b 0

:error
echo.
echo Une erreur est survenue. Regarde le message affiche juste au-dessus.
pause
exit /b 1
