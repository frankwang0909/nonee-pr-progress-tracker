#!/usr/bin/env node

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const root = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const safePath = (urlPath) => {
  const trimmed = urlPath.split('?')[0].split('#')[0];
  const withIndex = trimmed === '/' ? '/index.html' : trimmed;
  const normalized = normalize(withIndex).replace(/^\.\.(\/|\\|$)+/, '');
  return join(root, normalized);
};

createServer(async (req, res) => {
  try {
    const path = safePath(req.url || '/');
    const body = await readFile(path);
    const type = mime[extname(path)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
}).listen(port, () => {
  process.stdout.write(`Dashboard ready at http://localhost:${port}\n`);
});
