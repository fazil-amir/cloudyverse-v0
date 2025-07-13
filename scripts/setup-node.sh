#!/bin/bash

# CloudyVerse Node.js Setup Script
# This script helps ensure the correct Node.js version is being used

echo "🌩️ CloudyVerse Node.js Setup"
echo "=============================="

# Check if nvm is available
if command -v nvm &> /dev/null; then
    echo "✅ nvm found"
    
    # Check if the required version is installed
    if nvm list | grep -q "v22.14.0"; then
        echo "✅ Node.js v22.14.0 is already installed"
    else
        echo "📦 Installing Node.js v22.14.0..."
        nvm install 22.14.0
    fi
    
    # Switch to the correct version
    echo "🔄 Switching to Node.js v22.14.0..."
    nvm use 22.14.0
    
    # Verify the version
    CURRENT_VERSION=$(node --version)
    if [ "$CURRENT_VERSION" = "v22.14.0" ]; then
        echo "✅ Successfully switched to Node.js v22.14.0"
    else
        echo "❌ Failed to switch to Node.js v22.14.0. Current version: $CURRENT_VERSION"
        exit 1
    fi
    
elif command -v fnm &> /dev/null; then
    echo "✅ fnm found"
    
    # Check if the required version is installed
    if fnm list | grep -q "22.14.0"; then
        echo "✅ Node.js v22.14.0 is already installed"
    else
        echo "📦 Installing Node.js v22.14.0..."
        fnm install 22.14.0
    fi
    
    # Switch to the correct version
    echo "🔄 Switching to Node.js v22.14.0..."
    fnm use 22.14.0
    
    # Verify the version
    CURRENT_VERSION=$(node --version)
    if [ "$CURRENT_VERSION" = "v22.14.0" ]; then
        echo "✅ Successfully switched to Node.js v22.14.0"
    else
        echo "❌ Failed to switch to Node.js v22.14.0. Current version: $CURRENT_VERSION"
        exit 1
    fi
    
else
    echo "❌ Neither nvm nor fnm found"
    echo "Please install a Node.js version manager:"
    echo "  - nvm: https://github.com/nvm-sh/nvm"
    echo "  - fnm: https://github.com/Schniz/fnm"
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now run:"
echo "  npm install"
echo "  npm run dev" 