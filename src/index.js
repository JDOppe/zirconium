const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const { hostname } = require("node:os");
const { join } = require("path");
const wisp = require("wisp-server-node");
const { baremuxPath } = require('@mercuryworkshop/bare-mux/node');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static("./public"));
app.use("/uv/", express.static(uvPath));
app.use('/baremux/', express.static(baremuxPath));

const pages = [
  { url: "/", lastmod: "2024-01-01", priority: "1.0" },
];

app.get("/sitemap.xml", (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map(
        (page) => `
      <url>
        <loc>https://arsenic.smartfoloo.space${page.url}</loc>
        <lastmod>${page.lastmod}</lastmod>
        <priority>${page.priority}</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});

// Export the Express app as the handler for Vercel
module.exports = (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
};

// We don't need the createServer and listen calls in a serverless environment
// The upgrade handling for WebSockets needs to be done differently on Vercel
// Vercel provides specific ways to handle WebSockets in their environment

// The graceful shutdown logic is also not directly applicable in the same way
// in a serverless environment.
