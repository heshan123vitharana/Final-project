@echo off
echo ========================================
echo   PMB Newsletter Logo Setup
echo ========================================
echo.

REM Check if frontend logo exists
if exist "..\frontend\public\logo.png" (
    echo [OK] Found logo at: frontend\public\logo.png
    echo.
    echo Copying logo to backend assets folder...
    copy "..\frontend\public\logo.png" "assets\pmb-logo.png"
    
    if %ERRORLEVEL% == 0 (
        echo [SUCCESS] Logo copied successfully!
        echo Location: backend\assets\pmb-logo.png
    ) else (
        echo [ERROR] Failed to copy logo
    )
) else (
    echo [WARNING] Logo not found at frontend\public\logo.png
    echo.
    echo Please manually copy your logo file to:
    echo backend\assets\pmb-logo.png
)

echo.
echo ========================================
echo Setup complete! Now restart your backend server.
echo ========================================
pause
