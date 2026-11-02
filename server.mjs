import http from 'node:http';
import fs from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  // Health probe endpoint
  if (pathname === '/api/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      status: 'operational',
      cluster: 'ap-south-1',
      version: '1.4.2-beta',
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }, null, 2));
    return;
  }

  // Resolve safe filesystem path
  const normalizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, normalizedPath);

  try {
    let stat = null;
    if (existsSync(filePath)) {
      stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        if (existsSync(filePath)) {
          stat = await fs.stat(filePath);
        } else {
          stat = null;
        }
      }
    }

    // SPA fallback: if file doesn't exist and request has no extension, serve index.html
    if (!stat && !path.extname(pathname)) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
      if (existsSync(filePath)) {
        stat = await fs.stat(filePath);
      }
    }

    if (!stat) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    });

    const stream = createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  const localUrl = `http://localhost:${PORT}`;
  const networkUrl = `http://${HOST === '0.0.0.0' ? '127.0.0.1' : HOST}:${PORT}`;
  console.log(`[Ripto Develops] Engine v1.4.2-beta active`);
  console.log(`> Local:   ${localUrl}`);
  console.log(`> Network: ${networkUrl}`);
  console.log(`> Cluster: ap-south-1 (AWS Nitro micro-VMs)`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
