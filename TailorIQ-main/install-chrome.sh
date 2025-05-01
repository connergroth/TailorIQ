#!/bin/bash

# Script to install Chrome for Puppeteer in Render.com environment

echo "Installing Chrome for Puppeteer in Render.com environment..."

# Create cache directory if it doesn't exist
mkdir -p /opt/render/.cache/puppeteer

# Install Chrome using puppeteer's built-in command
npx puppeteer browsers install chrome

# Log installed Chrome version for debugging
CHROME_PATH=$(find /opt/render/.cache/puppeteer -name "chrome" -type f -executable)
if [ -n "$CHROME_PATH" ]; then
  echo "Chrome installed at: $CHROME_PATH"
  echo "Chrome version: $($CHROME_PATH --version)"
else
  echo "Chrome installation failed. Manual intervention required."
  echo "Cache directories:"
  ls -la /opt/render/.cache/puppeteer || echo "Directory doesn't exist"
  
  # Try installing Chrome with npm directly
  echo "Trying alternative installation method..."
  npm install puppeteer
fi

echo "Chrome installation completed." 