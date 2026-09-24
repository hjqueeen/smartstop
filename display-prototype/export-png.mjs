/**
 * Capture kiosk screens at 1080×1920 PNG for Blender textures.
 * Usage: node export-png.mjs
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "exports");
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SCREENS = [
  { id: "live", file: "ui_live_abfahrten.png" },
  { id: "large", file: "ui_grossschrift.png" },
  { id: "netz", file: "ui_netzinfo.png" },
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function startServer(root) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const path = join(root, decodeURIComponent((req.url || "/").split("?")[0]));
        const data = await readFile(path === root || path.endsWith("/") ? join(root, "index.html") : path);
        res.writeHead(200, { "Content-Type": MIME[extname(path)] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("not found");
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function main() {
  const { mkdir } = await import("node:fs/promises");
  await mkdir(OUT_DIR, { recursive: true });

  const { server, port } = await startServer(__dirname);
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 2100, deviceScaleFactor: 1 });

    // Inject before load so Leaflet measures the real 1080×1920 kiosk
    await page.evaluateOnNewDocument(() => {
      const style = document.createElement("style");
      style.textContent = `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #000 !important;
          min-height: 0 !important;
          display: block !important;
        }
        .stage { gap: 0 !important; align-items: flex-start !important; }
        .hint, .toolbar { display: none !important; }
        .kiosk {
          width: 1080px !important;
          height: 1920px !important;
          max-width: none !important;
          max-height: none !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
        }
      `;
      document.documentElement.appendChild(style);
    });

    await page.goto(`http://127.0.0.1:${port}/index.html`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    await new Promise((r) => setTimeout(r, 500));

    for (const screen of SCREENS) {
      await page.evaluate((id) => {
        document.querySelector(`[data-go="${id}"]`)?.click();
      }, screen.id);

      // Wait for screen switch + map tiles (live)
      await page.waitForSelector(`.screen--${screen.id === "large" ? "large" : screen.id}.is-active`, {
        timeout: 10000,
      });

      if (screen.id === "live" || screen.id === "netz") {
        const mapId = screen.id === "live" ? "#live-map" : "#netz-map";
        await page.waitForFunction(
          (sel) => {
            const tiles = document.querySelectorAll(`${sel} .leaflet-tile-loaded`);
            return tiles.length >= 4;
          },
          { timeout: 20000 },
          mapId
        ).catch(() => {});
        await new Promise((r) => setTimeout(r, 1200));
        await page.evaluate(() => {
          window.dispatchEvent(new Event("resize"));
        });
        await new Promise((r) => setTimeout(r, 800));
      } else {
        await new Promise((r) => setTimeout(r, 400));
      }

      const kiosk = await page.$("#kiosk");
      const out = join(OUT_DIR, screen.file);
      await kiosk.screenshot({ path: out, type: "png" });
      console.log("wrote", out);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
