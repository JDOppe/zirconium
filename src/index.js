const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const { baremuxPath } = require('@mercuryworkshop/bare-mux/node');
const path = require('path');

const bare = createBareServer("/bare/");
const app = express();

app.get('/src', (req, res) => {
  res.send('This is the /src route.');
});

// Serve static files from the 'public' directory at the root
app.use(express.static(path.join(process.cwd(), 'public')));
app.use("/uv/", express.static(uvPath));
app.use('/baremux/', express.static(baremuxPath));

// Explicitly handle the root path to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Handle all other requests by passing them to the Express app
module.exports = (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
};
