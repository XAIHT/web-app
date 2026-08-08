from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(r"C:\Development\XAIHT\web-app\campaign\assets\gallery")
files = sorted(ROOT.glob("*.png"))
thumb_w, thumb_h, label_h = 320, 180, 24
cols = 4
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "#111516")
draw = ImageDraw.Draw(sheet)

bad_dimensions = []
for index, file in enumerate(files):
    image = Image.open(file).convert("RGB")
    if image.width < 1200 or image.height < 675:
        bad_dimensions.append((file.name, image.size))
    image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
    x = (index % cols) * thumb_w
    y = (index // cols) * (thumb_h + label_h)
    sheet.paste(image, (x, y))
    draw.text((x + 6, y + thumb_h + 4), file.stem, fill="#D6A84B")

target = ROOT.parent / "gallery-contact-sheet.png"
sheet.save(target)
print(f"images={len(files)} bad_dimensions={bad_dimensions} contact_sheet={target}")
