@echo off
echo Spouštím KontaktyAPI...
start "KontaktyAPI" cmd /k "cd KontaktyAPI && dotnet run"

echo Spouštím Flask...
start "Flask" cmd /k "cd kontakty-flask && venv\Scripts\activate && python hlavni.py"

echo Spouštím Frontend...
start "Frontend" cmd /k "cd kontakty-frontend && npm start"

echo Hotovo! Otevři http://localhost:3000