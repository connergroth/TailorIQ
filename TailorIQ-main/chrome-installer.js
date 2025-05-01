import { execSync, exec } from "child_process";
import fs from "fs";
import path from "path";

// Define the Chrome version to match what's expected
const CHROME_VERSION = "135.0.7049.114";
const CHROME_DIR =
  "/opt/render/.cache/puppeteer/chrome/linux-" + CHROME_VERSION;
const CHROME_EXEC = path.join(CHROME_DIR, "chrome-linux64/chrome");

// Function to install Chrome from the storage.googleapis.com URL
async function installChrome() {
  try {
    console.log(`Installing Chrome version ${CHROME_VERSION}...`);

    // Create the directory structure
    execSync(`mkdir -p ${CHROME_DIR}/chrome-linux64`);

    // Check if Chrome is already installed
    if (fs.existsSync(CHROME_EXEC)) {
      console.log(`Chrome is already installed at ${CHROME_EXEC}`);
      return true;
    }

    // Download Chrome
    const CHROME_URL = `https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip`;
    console.log(`Downloading Chrome from ${CHROME_URL}...`);
    execSync(`curl -sL "${CHROME_URL}" -o chrome.zip`);

    // Extract Chrome
    console.log("Extracting Chrome...");
    execSync(`unzip -q chrome.zip -d "${CHROME_DIR}"`);

    // Make Chrome executable
    execSync(`chmod +x "${CHROME_EXEC}"`);

    // Clean up
    execSync("rm chrome.zip");

    // Verify installation
    if (fs.existsSync(CHROME_EXEC)) {
      console.log(`Chrome installed successfully at ${CHROME_EXEC}`);
      execSync(`"${CHROME_EXEC}" --version`);

      // Set environment variable
      process.env.PUPPETEER_EXECUTABLE_PATH = CHROME_EXEC;
      console.log(`PUPPETEER_EXECUTABLE_PATH set to ${CHROME_EXEC}`);

      return true;
    } else {
      throw new Error("Chrome executable not found after installation");
    }
  } catch (error) {
    console.error("Error installing Chrome:", error);
    return false;
  }
}

// Alternative method: Try to use Puppeteer's built-in installation
async function tryPuppeteerInstall() {
  try {
    console.log("Trying to install Chrome using Puppeteer...");
    execSync("npx puppeteer browsers install chrome", { stdio: "inherit" });
    return true;
  } catch (error) {
    console.error("Error installing Chrome with Puppeteer:", error);
    return false;
  }
}

// Main installation function
async function main() {
  console.log("Starting Chrome installation...");

  // First try the direct download method
  const directInstallSuccess = await installChrome();

  // If direct installation failed, try Puppeteer's method
  if (!directInstallSuccess) {
    console.log("Direct installation failed, trying Puppeteer installation...");
    const puppeteerInstallSuccess = await tryPuppeteerInstall();

    if (!puppeteerInstallSuccess) {
      console.error("All Chrome installation methods failed");
      process.exit(1);
    }
  }

  console.log("✅ Chrome installation completed successfully");
}

main();
