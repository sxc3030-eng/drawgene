@echo off
chcp 65001 >nul
title Installation de l'assistant drawGene (Mistral local)
echo.
echo  =============================================
echo   Assistant drawGene - Mistral en local
echo  =============================================
echo.
where ollama >nul 2>nul
if errorlevel 1 (
  echo  Ollama n'est pas encore installé.
  echo  La page de téléchargement va s'ouvrir : installez Ollama,
  echo  puis relancez ce fichier.
  start https://ollama.com/download
  pause
  exit /b
)
echo  1/3  Autorisation de drawGene à utiliser Ollama...
setx OLLAMA_ORIGINS "https://sxc3030-eng.github.io,http://localhost,http://localhost:*,http://127.0.0.1:*" >nul
set OLLAMA_ORIGINS=https://sxc3030-eng.github.io,http://localhost,http://localhost:*,http://127.0.0.1:*
echo  2/3  Redémarrage d'Ollama...
taskkill /IM "ollama app.exe" /F >nul 2>nul
taskkill /IM ollama.exe /F >nul 2>nul
timeout /t 2 >nul
start "Ollama" /min ollama serve
timeout /t 4 >nul
echo  3/3  Téléchargement de Mistral (environ 4 Go, patience)...
ollama pull mistral
echo.
echo  Terminé ! Redémarrez l'ordinateur, puis ouvrez drawGene :
echo  le panneau Assistant affichera un point vert.
echo.
pause
