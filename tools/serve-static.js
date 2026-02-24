#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function resolvePath(urlPath) {
  const raw = decodeURIComponent(urlPath.split('?')[0]);
  const rel = raw === '/' ? '/CO33-Pictos.html' : raw;
  const clean = rel.replace(/^\/+/, '');
  const full = path.resolve(ROOT, clean);
  if (!full.startsWith(ROOT)) return null;
  return full;
}

const server = http.createServer(function (req, res) {
  const filePath = resolvePath(req.url || '/');
  if (!filePath) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  fs.stat(filePath, function (err, stat) {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');

    const stream = fs.createReadStream(filePath);
    stream.on('error', function () {
      res.statusCode = 500;
      res.end('Server error');
    });
    stream.pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', function () {
  console.log('[serve-static] http://127.0.0.1:' + PORT);
});

function shutdown() {
  server.close(function () {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
