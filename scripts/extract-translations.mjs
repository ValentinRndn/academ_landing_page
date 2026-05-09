// One-shot: pulls the `landing` and `mockup` blocks from c:/dev/Academ/i18n/locales/*.json
// and writes flat JSON files under src/i18n/<locale>.json. Run once.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const LOCALES = ['fr', 'en', 'ar', 'de', 'nl', 'sv', 'es', 'it'];
const SOURCE_DIR = 'c:/dev/Academ/i18n/locales';
const TARGET_DIR = path.join(process.cwd(), 'src', 'i18n');

await mkdir(TARGET_DIR, { recursive: true });

for (const locale of LOCALES) {
  const raw = await readFile(path.join(SOURCE_DIR, `${locale}.json`), 'utf8');
  const data = JSON.parse(raw);

  const out = {
    landing: data.landing || {},
    mockup: data.mockup || {},
    // Lift a few common keys we'll need on the landing.
    common: {
      join: data.common?.join || 'Join',
      viewAll: data.common?.viewAll || 'View all',
    },
  };

  await writeFile(
    path.join(TARGET_DIR, `${locale}.json`),
    JSON.stringify(out, null, 2),
    'utf8',
  );
  console.log(`wrote: src/i18n/${locale}.json`);
}
console.log('Done.');
