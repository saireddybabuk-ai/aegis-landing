import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

/**
 * This project uses `aegis.html` as its entry file instead of `index.html`,
 * so the folder can sit beside another project without a filename clash.
 *
 * Two things need handling for that to work end to end:
 *   1. Dev server - visiting "/" should serve aegis.html, not 404.
 *   2. Build - static hosts look for index.html, so the built file is
 *      renamed on the way out. Your source folder never contains one.
 */
function aegisEntry({ entry = "aegis.html", output = "index.html" } = {}) {
  let root = process.cwd();
  let outDir = "dist";

  return {
    name: "aegis-entry",

    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
    },

    // 1. Serve aegis.html at the root URL during `npm run dev`
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = (req.url || "").split("?")[0];
        if (url === "/" || url === "/index.html") {
          req.url = "/" + entry;
        }
        next();
      });
    },

    // 2. Rename dist/aegis.html -> dist/index.html after building
    closeBundle() {
      const dir = path.resolve(root, outDir);
      const from = path.join(dir, entry);
      const to = path.join(dir, output);
      if (fs.existsSync(from)) {
        fs.renameSync(from, to);
        console.log("\n  aegis-entry: " + entry + " -> " + output + " in " + outDir + "/\n");
      }
    },
  };
}

/**
 * GitHub Pages serves a project repo from a subfolder, so assets need a
 * base path of "/<repo-name>/". Getting this wrong is the usual cause of a
 * blank white page.
 *
 * Rather than have you uncomment a line and remember to put it back, this
 * reads the repo name from the environment GitHub Actions provides:
 *
 *   - GitHub Actions -> "/<your-repo-name>/"  (set automatically)
 *   - Local, Vercel, Netlify -> "/"
 *
 * Nothing to edit. If you later point a custom domain at Pages, add a
 * repository variable CUSTOM_DOMAIN with the value true.
 */
function resolveBase() {
  const onActions = process.env.GITHUB_ACTIONS === "true";
  const customDomain = process.env.CUSTOM_DOMAIN === "true";
  if (!onActions || customDomain) return "/";

  const repo = (process.env.GITHUB_REPOSITORY || "").split("/")[1];
  if (!repo) return "/";

  // A <user>.github.io repo is served from the domain root, not a subfolder.
  if (repo.endsWith(".github.io")) return "/";

  return "/" + repo + "/";
}

export default defineConfig({
  base: resolveBase(),

  plugins: [react(), aegisEntry()],

  build: {
    rollupOptions: {
      input: path.resolve(process.cwd(), "aegis.html"),
    },
  },

  server: {
    port: 5173,
    open: true,
  },
});
