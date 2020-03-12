const fs = require("fs");
const path = require("path");

const manifest = require("../public/manifest.json");
const assetManifest = require("../build/asset-manifest.json");

manifest.content_scripts[0].js = assetManifest.entrypoints.filter(e =>
  e.startsWith("static/js/")
);

manifest.content_scripts[0].css = assetManifest.entrypoints.filter(e =>
  e.startsWith("static/css/")
);

const data = JSON.stringify(manifest, null, 2);
fs.writeFileSync(path.join(__dirname, "../build/manifest.json"), data);
