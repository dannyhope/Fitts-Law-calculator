const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(fs.readFileSync(path.join(__dirname, '..', '.dev-port'), 'utf8').trim());
const root = path.join(__dirname, '..');

const server = http.createServer((request, response) => {
  const requestedPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = path.resolve(root, `.${requestedPath}`);

  if (!filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500);
      response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    response.writeHead(200, { 'Content-Type': contentType(filePath) });
    response.end(content);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Fitts' Law Calculator running at http://127.0.0.1:${port}/`);
});

function contentType(filePath) {
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
  }[path.extname(filePath)] || 'application/octet-stream';
}
