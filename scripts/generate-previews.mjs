import { readdir, readFile, mkdir, writeFile, rm, access } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, PDFName } from 'pdf-lib';

const root = path.resolve('Content/MedWIZ');
const output = path.resolve('preview-source');
// Public clones contain only the verified previews, never the original courses.
try { await access(root); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const manifest = JSON.parse(await readFile('lib/courses.generated.json', 'utf8'));
  if (!manifest.length) throw new Error('No generated courses found');
  for (const course of manifest) {
    const pdf = await PDFDocument.load(await readFile(path.join(output, `${course.id}.pdf`)));
    if (pdf.getPageCount() !== course.previewPages || course.previewPages > 10) throw new Error(`Invalid preview: ${course.id}`);
  }
  console.log(`Using ${manifest.length} verified public previews. Original courses are local only.`);
  process.exit(0);
}
const slugify = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
const files = (await walk(root)).filter(f => /\.pdf$/i.test(f)).sort();
if (!files.length) throw new Error('No MedWIZ courses found');
await mkdir(output, { recursive: true });
const courses = [];
for (const file of files) {
  const match = /^MW-(\d+)-(.+)\.pdf$/i.exec(path.basename(file));
  if (!match) throw new Error(`Unexpected course filename: ${file}`);
  const year = Number(match[1]);
  const title = match[2].replace(/_/g, '’');
  const slug = slugify(title);
  const id = `${year}-${slug}`;
  if (courses.some(c => c.id === id)) throw new Error(`Duplicate course: ${id}`);
  const source = await PDFDocument.load(await readFile(file));
  const previewPages = Math.min(10, source.getPageCount());
  if (!previewPages) throw new Error(`Empty PDF: ${file}`);
  const preview = await PDFDocument.create();
  const pages = await preview.copyPages(source, Array.from({ length: previewPages }, (_, i) => i));
  // Remove annotations, which may link to pages outside the preview or attach files.
  for (const page of pages) { page.node.delete(PDFName.of('Annots')); preview.addPage(page); }
  preview.setTitle(`${title} — MedWIZ preview`);
  const bytes = await preview.save();
  const checked = await PDFDocument.load(bytes);
  if (checked.getPageCount() !== previewPages) throw new Error(`Invalid preview: ${id}`);
  await writeFile(path.join(output, `${id}.pdf`), bytes);
  courses.push({ id, year, slug, title, category: file.includes('UEI') ? 'Integrated units' : 'Modules', pages: source.getPageCount(), previewPages, previewUrl: `/course-previews/${id}.pdf` });
}
// Only remove obsolete generated PDFs from this dedicated output directory.
const expected = new Set(courses.map(c => `${c.id}.pdf`));
for (const name of await readdir(output)) {
  if (name.endsWith('.pdf') && !expected.has(name)) await rm(path.join(output, name));
}
await writeFile('lib/courses.generated.json', JSON.stringify(courses, null, 2) + '\n');
console.log(`Generated and verified ${courses.length} previews (maximum 10 pages each).`);
