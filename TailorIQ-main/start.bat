@echo off
echo Starting TailorIQ Resume Builder...

:: Set the environment variable for production
set NODE_ENV=production

:: Start the application
node dist/index.js

pause