const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const { baremuxPath } = require('@mercuryworkshop/bare-mux/node');
const path = require('path');

const bare = createBareServer("/bare/");
const app = express();

// Serve static files from the 'public' directory at the root
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uv/", express.static(uvPath));
app.use('/baremux/', express.static(baremuxPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export the Express app as the Vercel handler
module.exports = (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
};
