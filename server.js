#!/usr/bin/env node
const prerender = require('./lib');
const util = require('./lib/util');

const browserLocation = process.env.BROWSER || '/usr/bin/chromium-browser';
util.log(`browserLocation: ${browserLocation}`)

const server = prerender({
    chromeFlags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars', '--disable-dev-shm-usage'],
    forwardHeaders: true,
    chromeLocation: browserLocation
});


if (process.env.AUTH_TOKEN) {
  util.log("EnabledPlugin: tokenAuth")
  server.use(prerender.tokenAuth()); 
}
server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
// server.use(prerender.blockResources());
server.use(prerender.addMetaTags());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

if (process.env.S3_BUCKET_NAME) {
  util.log("EnabledPlugin: s3Cache")
  server.use(prerender.s3Cache());
}

server.start();
