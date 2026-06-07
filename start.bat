@echo off

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js neni nainstalovan!
    echo Stahni ho z https://nodejs.org a znovu spust start.bat
    pause
    exit
)

where dotnet >nul 2>&1
if %errorlevel% neq 0 (
    echo .NET SDK neni nainstalovan!
    echo Stahni ho z https://dotnet.microsoft.com a znovu spust start.bat
    pause
    exit
)

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Python neni nainstalovan!
    echo Stahni ho z https://python.org a znovu spust start.bat
    pause
    exit
)

echo Spouštím KontaktyAPI...
start "KontaktyAPI" cmd /k "cd /d %~dp0KontaktyAPI && dotnet run"
echo Spouštím Flask...
start "Flask" cmd /k "cd /d %~dp0kontakty-flask && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python hlavni.py"
echo Spouštím Frontend...
start "Frontend" cmd /k "cd /d %~dp0kontakty-frontend && npm install && npm start"
echo Hotovo! Otevři http://localhost:3000
