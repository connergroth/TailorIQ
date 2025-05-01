import fs from "fs";
import { execSync } from "child_process";
import path from "path";

// Define the expected Chrome location from environment variable
const chromeExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
const chromeVersion = "135.0.7049.114";
const cacheDir =
  process.env.PUPPETEER_CACHE_DIR || "/opt/render/.cache/puppeteer";
const expectedChromeDir = path.join(
  cacheDir,
  "chrome",
  `linux-${chromeVersion}`
);
const expectedChromePath = path.join(
  expectedChromeDir,
  "chrome-linux64/chrome"
);

console.log("Chrome executable path from env:", chromeExecutablePath);
console.log("Expected Chrome path:", expectedChromePath);

// Check if Chrome is installed
function isChromeMissing() {
  // Check if Chrome exists at the expected location
  if (chromeExecutablePath && fs.existsSync(chromeExecutablePath)) {
    console.log(`Chrome found at: ${chromeExecutablePath}`);
    return false;
  }

  // Check if Chrome exists at the default location
  if (fs.existsSync(expectedChromePath)) {
    console.log(`Chrome found at default location: ${expectedChromePath}`);
    // Set environment variable to the found Chrome
    process.env.PUPPETEER_EXECUTABLE_PATH = expectedChromePath;
    return false;
  }

  console.log("Chrome not found in expected locations");
  return true;
}

// Main function to ensure Chrome is installed
function ensureChrome() {
  if (!isChromeMissing()) {
    console.log("Chrome is already installed");
    return;
  }

  console.log("Chrome is missing, attempting to install...");

  try {
    // First try to install using chrome-installer.js
    console.log("Running chrome-installer.js...");
    execSync("node chrome-installer.js", { stdio: "inherit" });

    if (!isChromeMissing()) {
      console.log("Chrome successfully installed using chrome-installer.js");
      return;
    }

    // If that fails, try Puppeteer's built-in installation
    console.log("Trying to install Chrome using Puppeteer...");
    execSync("npx puppeteer browsers install chrome", { stdio: "inherit" });

    if (!isChromeMissing()) {
      console.log("Chrome successfully installed using Puppeteer");
      return;
    }

    console.log("All Chrome installation methods failed");
  } catch (error) {
    console.error("Error ensuring Chrome is installed:", error);
  }
}

ensureChrome();
