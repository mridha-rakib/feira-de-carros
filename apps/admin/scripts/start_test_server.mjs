process.env.ADMIN_E2E_MOCK = 'true';
process.env.APP_ENV = 'test';
process.env.NEXT_PUBLIC_APP_ENV = 'test';

import http from 'node:http';
import path from 'node:path';
import next from 'next';

const PORT = process.env.PORT || 3001;
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
