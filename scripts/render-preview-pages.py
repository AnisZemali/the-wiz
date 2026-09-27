"""Render only the already truncated public previews for the mobile reader."""
import json
from pathlib import Path
import pymupdf as fitz

root = Path(__file__).resolve().parent.parent
for course in json.loads((root / 'lib/courses.generated.json').read_text(encoding='utf-8')):
    doc = fitz.open(root / 'public' / course['previewUrl'].lstrip('/'))
    assert len(doc) == course['previewPages'] <= 10, course['id']
    destination = root / 'public/course-pages' / course['id']
    destination.mkdir(parents=True, exist_ok=True)
    for number, page in enumerate(doc, 1):
        pix = page.get_pixmap(matrix=fitz.Matrix(1400 / page.rect.width, 1400 / page.rect.width), alpha=False)
        pix.pil_save(str(destination / f'{number}.webp'), format='WEBP', quality=84)
    print(f"{course['id']}: {len(doc)} pages")
