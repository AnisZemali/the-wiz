"""Optional publishing step: python -m pip install 'pymupdf>=1.26'
Run after npm run previews to reduce preview download sizes.
"""
from pathlib import Path
import pymupdf
import time

root = Path(__file__).resolve().parents[1] / 'public' / 'course-previews'
before = after = 0
for path in sorted(root.glob('*.pdf')):
    if path.name.endswith('.optimized.pdf'):
        continue
    before += path.stat().st_size
    with pymupdf.open(path) as document:
        assert 0 < len(document) <= 10, f'Invalid preview: {path.name}'
        pages = len(document)
        document.rewrite_images(dpi_threshold=180, dpi_target=150, quality=85)
        data = document.tobytes(garbage=4, deflate=True)
    with pymupdf.open(stream=data, filetype='pdf') as checked:
        assert len(checked) == pages
    temporary = path.with_suffix('.optimized.pdf')
    temporary.write_bytes(data)
    for attempt in range(10):
        try:
            temporary.replace(path)
            break
        except PermissionError:
            if attempt == 9:
                raise
            time.sleep(1)
    after += len(data)
print(f'Preview PDFs: {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB')
