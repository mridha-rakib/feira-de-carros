process.env.FEIRA_E2E_MOCK = 'true';

import http from 'node:http';
import path from 'node:path';
import next from 'next';

const PORT = process.env.PORT || 3000;
const app = next({
  dev: false,
  dir: path.resolve(import.meta.dirname, '..'),
  quiet: false,
});

await app.prepare();
const handle = app.getRequestHandler();
const server = http.createServer((req, res) => handle(req, res));
server.listen(PORT, () => {
  console.log(`Ready on http://localhost:${PORT}`);
});
