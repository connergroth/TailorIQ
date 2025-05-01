import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Log the static files path for debugging
  log(`Serving static files from: ${distPath}`, "static");

  // Serve static files with explicit cache control and content type handling
  app.use(express.static(distPath, {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Set cache control headers based on file type
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.webmanifest')) {
        res.setHeader('Content-Type', 'application/manifest+json');
      }
      
      // Set cache control for all static assets
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }));

  // Add error handling for static file serving
  app.use((err: any, req: any, res: any, next: any) => {
    if (err) {
      log(`Error serving static file: ${req.path} - ${err.message}`, "static-error");
      return res.status(500).send('Error serving static file');
    }
    next();
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    try {
      log(`Serving index.html for path: ${_req.originalUrl}`, "static");
      res.sendFile(path.resolve(distPath, "index.html"));
    } catch (err) {
      log(`Error serving index.html: ${err}`, "static-error");
      res.status(500).send('Error serving application');
    }
  });
}
