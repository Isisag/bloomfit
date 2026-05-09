/* global URL, console */
import { readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(__dirname, '..', 'dist');

async function collectFiles(dir, base = dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(full, base, out);
    } else if (/\.(js|css|html|svg|png|ico|woff2|webmanifest)$/.test(entry.name)) {
      out.push('/' + relative(base, full).replace(/\\/g, '/'));
    }
  }
  return out;
}

const allFiles = await collectFiles(distDir);
const SKIP = new Set(['/sw.js', '/registerSW.js']);
const precache = allFiles.filter(f => !SKIP.has(f));

// Also cache clean directory URLs (/ /login/ /workout/ etc.) alongside index.html
// so caches.match hits when the browser navigates to the clean URL
const cleanUrls = precache
  .filter(f => f.endsWith('/index.html'))
  .map(f => f.slice(0, -'index.html'.length) || '/');
const precacheAll = [...new Set([...precache, ...cleanUrls])];

const version = `v${Date.now()}`;

const sw = [
  `const CACHE = 'bloomfit-${version}';`,
  `const PRECACHE = ${JSON.stringify(precacheAll, null, 2)};`,
  '',
  "self.addEventListener('install', e => {",
  "  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));",
  '});',
  '',
  "self.addEventListener('activate', e => {",
  "  e.waitUntil(",
  '    caches.keys()',
  '      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))',
  '      .then(() => self.clients.claim())',
  '  );',
  '});',
  '',
  "self.addEventListener('fetch', e => {",
  "  if (e.request.method !== 'GET') return;",
  "  if (new URL(e.request.url).origin !== self.location.origin) return;",
  "  e.respondWith(caches.match(e.request).then(hit => hit ?? fetch(e.request)));",
  '});',
].join('\n');

await writeFile(join(distDir, 'sw.js'), sw + '\n', 'utf8');
console.log(`[gen-sw] dist/sw.js generated (${precacheAll.length} files, cache ${version})`);
