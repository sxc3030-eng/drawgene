@echo off
chcp 65001 >nul
title Installation de Lia (drawGene) sur cet ordinateur
echo.
echo  =============================================
echo   Lia - l'assistante de drawGene, sur ce PC
echo   (rien ne sort de l'ordinateur)
echo  =============================================
echo.
where ollama >nul 2>nul
if errorlevel 1 (
  echo  Ollama n'est pas encore installe.
  echo  La page de telechargement va s'ouvrir : cliquez
  echo  "Download for Windows", installez, puis relancez ce fichier.
  start https://ollama.com/download
  pause
  exit /b
)
echo  1/3  drawGene a le droit de parler a Ollama...
setx OLLAMA_ORIGINS "https://sxc3030-eng.github.io,http://localhost,http://localhost:*,http://127.0.0.1:*" >nul
set OLLAMA_ORIGINS=https://sxc3030-eng.github.io,http://localhost,http://localhost:*,http://127.0.0.1:*
echo  2/3  Redemarrage d'Ollama...
taskkill /IM "ollama app.exe" /F >nul 2>nul
taskkill /IM ollama.exe /F >nul 2>nul
timeout /t 2 >nul
if exist "%LOCALAPPDATA%\Programs\Ollama\ollama app.exe" (start "" "%LOCALAPPDATA%\Programs\Ollama\ollama app.exe") else (start "Ollama" /min ollama serve)
timeout /t 6 >nul
echo  3/3  Telechargement du cerveau de Lia (Ministral 8B, environ 6 Go)...
echo       Laissez la fenetre ouverte, ca peut prendre un bon moment.
ollama pull ministral-3:8b
if errorlevel 1 (
  echo.
  echo  Le telechargement a echoue. Verifiez internet et relancez ce fichier.
  pause
  exit /b
)
echo.
echo  Termine ! Ouvrez drawGene, cliquez "Lia" puis "C'est fait, reessayer".
echo.
pause
