import fs from "fs";
import { execSync } from "child_process";
import path from "path";

// Get Chrome paths from environment variables
const chromeExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
const chromeVersion = "135.0.7049.114";
const cacheDir =
  process.env.PUPPETEER_CACHE_DIR || "/opt/render/.cache/puppeteer";

console.log("====== Chrome Installation Diagnostics ======");
console.log("Environment variables:");
console.log(`PUPPETEER_EXECUTABLE_PATH: ${chromeExecutablePath || "Not set"}`);
console.log(`PUPPETEER_CACHE_DIR: ${cacheDir || "Not set"}`);

// Check possible Chrome locations
const possibleLocations = [
  chromeExecutablePath,
  path.join(
    cacheDir,
    "chrome",
    `linux-${chromeVersion}`,
    "chrome-linux64",
    "chrome"
  ),
  path.join(
    cacheDir,
    `chrome-linux-${chromeVersion}`,
    "chrome-linux",
    "chrome"
  ),
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/opt/google/chrome/chrome",
];

console.log("\nChecking possible Chrome locations:");
let chromeFound = false;

for (const location of possibleLocations) {
  if (!location) continue;

  if (fs.existsSync(location)) {
    console.log(`✅ Chrome found at: ${location}`);
    chromeFound = true;

    try {
      const version = execSync(`"${location}" --version`, {
        encoding: "utf8",
      }).trim();
      console.log(`   Version: ${version}`);
    } catch (err) {
      console.log(`   Could not get version: ${err.message}`);
    }
  } else {
    console.log(`❌ Chrome not found at: ${location}`);
  }
}

// Check directory structure
const chromeDir = path.join(cacheDir, "chrome", `linux-${chromeVersion}`);
console.log("\nChecking Chrome directory structure:");

if (fs.existsSync(chromeDir)) {
  console.log(`✅ Chrome directory exists: ${chromeDir}`);

  try {
    const dirContents = execSync(`ls -la "${chromeDir}"`, {
      encoding: "utf8",
    }).trim();
    console.log("Directory contents:");
    console.log(dirContents);
  } catch (err) {
    console.log(`Could not list directory: ${err.message}`);
  }
} else {
  console.log(`❌ Chrome directory not found: ${chromeDir}`);
}

// Check user permissions
console.log("\nChecking user permissions:");
try {
  const whoami = execSync("whoami", { encoding: "utf8" }).trim();
  console.log(`Current user: ${whoami}`);

  if (chromeExecutablePath && fs.existsSync(chromeExecutablePath)) {
    const permissions = execSync(`ls -la "${chromeExecutablePath}"`, {
      encoding: "utf8",
    }).trim();
    console.log(`Chrome file permissions: ${permissions}`);
  }
} catch (err) {
  console.log(`Could not check permissions: ${err.message}`);
}

// Print summary
console.log("\n====== Summary ======");
if (chromeFound) {
  console.log("✅ Chrome was found on this system");
  if (!chromeExecutablePath || !fs.existsSync(chromeExecutablePath)) {
    console.log("⚠️ Warning: PUPPETEER_EXECUTABLE_PATH is not set correctly");
    console.log("   Set it to one of the found Chrome locations");
  }
} else {
  console.log("❌ Chrome was not found on this system");
  console.log("   Run the chrome-installer.js script to install Chrome");
}

console.log("\n====== End of Diagnostics ======");
