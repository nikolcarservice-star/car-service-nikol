@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Nikol CRM — сборка программы
echo ========================================
echo.

cd /d "%~dp0"

REM Все кэши и готовые файлы — на диск D: (место не занимает C:)
set "BUILD_DISK=D:"
set "BUILD_ROOT=%BUILD_DISK%\nikol-crm-build"
set "NPM_CONFIG_CACHE=%BUILD_ROOT%\npm-cache"
set "ELECTRON_CACHE=%BUILD_ROOT%\electron-cache"
set "ELECTRON_BUILDER_CACHE=%BUILD_ROOT%\electron-builder-cache"
set "DIST_OUTPUT=%BUILD_ROOT%\dist"

if not exist "%BUILD_ROOT%" mkdir "%BUILD_ROOT%"
if not exist "%NPM_CONFIG_CACHE%" mkdir "%NPM_CONFIG_CACHE%"
if not exist "%ELECTRON_CACHE%" mkdir "%ELECTRON_CACHE%"
if not exist "%ELECTRON_BUILDER_CACHE%" mkdir "%ELECTRON_BUILDER_CACHE%"
if not exist "%DIST_OUTPUT%" mkdir "%DIST_OUTPUT%"

echo Сборка на диск %BUILD_DISK%:  %BUILD_ROOT%
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ОШИБКА] Node.js не найден.
    echo.
    echo Установите Node.js с https://nodejs.org
    echo После установки перезапустите этот файл.
    echo.
    pause
    exit /b 1
)

REM Проверка прав на создание символических ссылок (нужно для electron-builder)
set "SYMLINK_TEST_DIR=%BUILD_ROOT%\_symlink_test"
if not exist "%SYMLINK_TEST_DIR%" mkdir "%SYMLINK_TEST_DIR%"
echo test> "%SYMLINK_TEST_DIR%\target.txt"
del /f /q "%SYMLINK_TEST_DIR%\link.txt" >nul 2>nul
mklink "%SYMLINK_TEST_DIR%\link.txt" "%SYMLINK_TEST_DIR%\target.txt" >nul 2>nul
if errorlevel 1 (
    echo [ОШИБКА] Windows запрещает создавать символические ссылки (mklink).
    echo Это нужно для сборки Electron (electron-builder).
    echo.
    echo Решение 1 (рекомендуется): включить Developer Mode:
    echo   Параметры ^> Конфиденциальность и безопасность ^> Для разработчиков ^> Режим разработчика = ВКЛ
    echo.
    echo Решение 2: запустить этот файл от администратора:
    echo   ПКМ по "Собрать программу.bat" ^> Запуск от имени администратора
    echo.
    echo После этого запустите сборку снова.
    echo.
    pause
    exit /b 1
)
del /f /q "%SYMLINK_TEST_DIR%\link.txt" >nul 2>nul
del /f /q "%SYMLINK_TEST_DIR%\target.txt" >nul 2>nul
rmdir "%SYMLINK_TEST_DIR%" >nul 2>nul

echo Шаг 1/2: Установка зависимостей (кэш на %BUILD_DISK%:)...
call npm install
if errorlevel 1 (
    echo.
    echo Не удалось выполнить npm install.
    pause
    exit /b 1
)

echo.
echo Шаг 2/2: Сборка программы (результат на %BUILD_DISK%:)...
set "BUILD_OUTPUT=%DIST_OUTPUT%"
call npm run build
if errorlevel 1 (
    echo.
    echo Ошибка при сборке.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Готово!
echo ========================================
echo.
echo Файлы находятся в папке:  %DIST_OUTPUT%
echo   - Nikol CRM Setup 1.0.0.exe  (установщик)
echo   - Nikol CRM 1.0.0.exe       (без установки)
echo.

if exist "%DIST_OUTPUT%" start "" "%DIST_OUTPUT%"

pause
