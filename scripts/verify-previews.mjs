import { readFile, readdir } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
const courses=JSON.parse(await readFile(new URL('../lib/courses.generated.json',import.meta.url),'utf8'));
for(const course of courses){
 const pdf=await PDFDocument.load(await readFile(new URL('../preview-source/'+course.id+'.pdf',import.meta.url)));
 if(pdf.getPageCount()!==course.previewPages || course.previewPages>10) throw new Error('Invalid preview: '+course.id);
 const pages=await readdir(new URL('../public/course-pages/'+course.id+'/',import.meta.url));
 const expected=Array.from({length:course.previewPages},(_,i)=>(i+1)+'.webp');
 if(pages.length!==expected.length || expected.some(p=>!pages.includes(p))) throw new Error('Invalid page images: '+course.id);
}
console.log('Verified '+courses.length+' private preview PDFs and their public page images: maximum ten pages each.');
