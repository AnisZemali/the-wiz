import { rename, writeFile, readdir, readFile, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { PDFDocument } from 'pdf-lib';

const courses = JSON.parse(await readFile('lib/courses.generated.json', 'utf8'));
for (const course of courses) {
  const pdf = await PDFDocument.load(await readFile(`public/course-previews/${course.id}.pdf`));
  if (pdf.getPageCount() !== course.previewPages || course.previewPages > 10) {
    throw new Error(`Invalid public preview: ${course.id}`);
  }
}

// Preserve the server endpoint for normal Next.js deployments.
const route = 'app/api';
const disabled = 'api.disabled';
// Next's export mode uses .next internally even when distDir names the export.
// Preserve the normal build so exporting cannot break localhost CSS/JS paths.
const backup = await mkdtemp(path.join(os.tmpdir(), 'wiz-next-backup-'));
let preserved = false;
let movedApi = false;
try {
  try { await rename('.next', path.join(backup, 'normal')); preserved = true; }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  await rename(route, disabled); movedApi = true;
  const build = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
    stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_GITHUB_PAGES: 'true' },
  });
  if (build.status !== 0) throw new Error('GitHub Pages build failed');
  await writeFile('.next-pages/.nojekyll', '');
  async function setFrenchLanguage(dir, locale) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await setFrenchLanguage(path, locale);
      else if (entry.name.endsWith('.html')) {
        const html = await readFile(path, 'utf8');
        await writeFile(path, html.replace('<html lang="en"', `<html lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}"`));
      }
    }
  }
  await setFrenchLanguage('.next-pages/fr', 'fr');
  await setFrenchLanguage('.next-pages/ar', 'ar');
} finally {
  if (movedApi) await rename(disabled, route);
  if (preserved) {
    try { await rename('.next', path.join(backup, 'export')); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
    await rename(path.join(backup, 'normal'), '.next');
  }
  // Only delete this script's newly created temporary directory.
  if (path.dirname(backup) === path.resolve(os.tmpdir()) && path.basename(backup).startsWith('wiz-next-backup-')) await rm(backup, { recursive: true, force: true });
}
