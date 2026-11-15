@echo off
rem PsikoVaka - tek adimda yayin. Cift tiklayin; gerisini deploy_to_github.js yapar:
rem vakalari dogrular, tek dosyalik surumu ve Supabase cevap anahtarini uretir, GitHub'a gonderir.
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [HATA] Node.js bulunamadi.
  echo Node.js LTS surumunu https://nodejs.org adresinden kurun,
  echo bilgisayari yeniden baslatin ve bu dosyayi tekrar calistirin.
  echo.
  pause
  exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
  echo.
  echo [HATA] Git bulunamadi.
  echo Git for Windows'u https://git-scm.com/download/win adresinden kurun,
  echo bilgisayari yeniden baslatin ve bu dosyayi tekrar calistirin.
  echo.
  pause
  exit /b 1
)

node "%~dp0deploy_to_github.js" %*
set "SONUC=%ERRORLEVEL%"
echo.
if not "%SONUC%"=="0" echo Yukleme TAMAMLANMADI. Yukaridaki mesaji okuyun.
pause
exit /b %SONUC%
