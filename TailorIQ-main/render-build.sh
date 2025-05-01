#!/usr/bin/env bash
# Script to install Chrome on Render.com

set -e

echo "Installing dependencies for Chrome..."
apt-get update
apt-get install -y \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcairo2 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1

# Define Chrome version to download
CHROME_VERSION="135.0.7049.114"
CHROME_DIR="/opt/render/.cache/puppeteer/chrome/linux-$CHROME_VERSION"
CHROME_EXEC="$CHROME_DIR/chrome-linux64/chrome"

echo "Chrome directory: $CHROME_DIR"
echo "Chrome executable path: $CHROME_EXEC"

# Create the directory structure
mkdir -p "$CHROME_DIR/chrome-linux64"

# Check if Chrome is already installed
if [ -f "$CHROME_EXEC" ]; then
    echo "Chrome is already installed at $CHROME_EXEC"
else
    echo "Installing Chrome version $CHROME_VERSION..."
    
    # Download Chrome
    CHROME_URL="https://storage.googleapis.com/chrome-for-testing-public/$CHROME_VERSION/linux64/chrome-linux64.zip"
    echo "Downloading Chrome from $CHROME_URL..."
    curl -sL "$CHROME_URL" -o chrome.zip
    
    # Extract Chrome
    echo "Extracting Chrome..."
    unzip -q chrome.zip -d "$CHROME_DIR"
    
    # Check if the chrome-linux64 directory exists inside chrome-linux64
    if [ -d "$CHROME_DIR/chrome-linux64/chrome-linux64" ]; then
        echo "Fixing directory structure..."
        mv "$CHROME_DIR/chrome-linux64/chrome-linux64"/* "$CHROME_DIR/chrome-linux64/"
        rmdir "$CHROME_DIR/chrome-linux64/chrome-linux64"
    fi
    
    # Make Chrome executable
    chmod +x "$CHROME_EXEC"
    
    # Clean up
    rm chrome.zip
    
    echo "Chrome installed successfully at $CHROME_EXEC"
    "$CHROME_EXEC" --version || echo "Failed to get Chrome version"
fi

# Print directory structure for debugging
echo "Directory structure:"
find "$CHROME_DIR" -type f -name "chrome" | xargs ls -la

# Set environment variable to use our Chrome
echo "Setting PUPPETEER_EXECUTABLE_PATH to $CHROME_EXEC"
export PUPPETEER_EXECUTABLE_PATH="$CHROME_EXEC"

# Verify installation was successful
if [ -f "$CHROME_EXEC" ]; then
    echo "✅ Chrome installation completed successfully"
else
    echo "❌ Chrome installation failed"
    exit 1
fi 