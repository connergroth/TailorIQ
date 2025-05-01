import puppeteer from "puppeteer";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupChrome() {
  console.log("Setting up Chrome for Puppeteer...");

  try {
    // Try to install Chrome using puppeteer
    console.log("Installing Chrome...");
    execSync("npx puppeteer browsers install chrome", { stdio: "inherit" });

    // Verify installation by launching a browser
    console.log("Verifying Chrome installation...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    console.log("Chrome installed successfully!");
    await browser.close();
  } catch (error) {
    console.error("Error setting up Chrome:", error);
    process.exit(1);
  }
}

setupChrome();
