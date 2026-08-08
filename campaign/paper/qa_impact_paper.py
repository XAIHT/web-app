from pathlib import Path

import fitz
from PIL import Image, ImageDraw

ROOT = Path(r"C:\Development\XAIHT\web-app\campaign\paper")
PDF = ROOT / "Tlamatini_Global_Regional_Impact.pdf"
RENDER = ROOT / "rendered"
RENDER.mkdir(parents=True, exist_ok=True)

doc = fitz.open(PDF)
page_paths = []
text_chunks = []
empty_pages = []

for index, page in enumerate(doc):
    text = page.get_text("text").strip()
    text_chunks.append(f"\n--- PAGE {index + 1} ---\n{text}\n")
    if len(text) < 40:
        empty_pages.append(index + 1)
    pix = page.get_pixmap(matrix=fitz.Matrix(1.45, 1.45), alpha=False)
    output = RENDER / f"page-{index + 1:02d}.png"
    pix.save(output)
    page_paths.append(output)

(ROOT / "Tlamatini_Global_Regional_Impact_extracted.txt").write_text("".join(text_chunks), encoding="utf-8")

thumb_w = 210
thumb_h = 297
label_h = 22
cols = 4
rows = (len(page_paths) + cols - 1) // cols
sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "#111516")
draw = ImageDraw.Draw(sheet)
for index, image_path in enumerate(page_paths):
    image = Image.open(image_path).convert("RGB")
    image.thumbnail((thumb_w - 8, thumb_h - 8), Image.Resampling.LANCZOS)
    x = (index % cols) * thumb_w + (thumb_w - image.width) // 2
    y0 = (index // cols) * (thumb_h + label_h)
    y = y0 + (thumb_h - image.height) // 2
    sheet.paste(image, (x, y))
    draw.text((8 + (index % cols) * thumb_w, y0 + thumb_h + 3), f"PAGE {index + 1}", fill="#D6A84B")

sheet.save(RENDER / "paper-montage.png")
print(f"pages={len(doc)} empty_pages={empty_pages} montage={RENDER / 'paper-montage.png'}")
