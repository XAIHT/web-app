from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(r"C:\Development\XAIHT\web-app\campaign\decks\rendered")
SLIDE_W = 1280
SLIDE_H = 720


def intersects(a, b):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    left = max(ax, bx)
    top = max(ay, by)
    right = min(ax + aw, bx + bw)
    bottom = min(ay + ah, by + bh)
    return max(0, right - left) * max(0, bottom - top)


def audit_layout(path):
    payload = json.loads(path.read_text(encoding="utf-8"))
    out_of_bounds = []
    texts = []
    for element in payload.get("elements", []):
        bbox = element.get("bbox")
        if not bbox:
            continue
        x, y, w, h = bbox
        if x < -0.5 or y < -0.5 or x + w > SLIDE_W + 0.5 or y + h > SLIDE_H + 0.5:
            out_of_bounds.append((element.get("textPreview") or element.get("kind"), bbox))
        value = (element.get("textPreview") or element.get("text") or "").strip()
        if value:
            texts.append((value, bbox))
    collisions = []
    for index, (first_text, first_box) in enumerate(texts):
        for second_text, second_box in texts[index + 1:]:
            area = intersects(first_box, second_box)
            if area > 4:
                collisions.append((first_text[:40], second_text[:40], round(area, 1)))
    return out_of_bounds, collisions


def contact_sheet(deck_dir):
    slides = sorted(deck_dir.glob("slide-*.png"))
    thumb_w, thumb_h, label_h = 320, 180, 24
    cols = 4
    rows = (len(slides) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "#111516")
    draw = ImageDraw.Draw(sheet)
    for index, slide_path in enumerate(slides):
        image = Image.open(slide_path).convert("RGB")
        image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = (index % cols) * thumb_w
        y = (index // cols) * (thumb_h + label_h)
        sheet.paste(image, (x, y))
        draw.text((x + 7, y + thumb_h + 4), f"SLIDE {index + 1}", fill="#D6A84B")
    target = deck_dir / "contact-sheet.png"
    sheet.save(target)
    return target


def main():
    summary = {}
    for deck_dir in sorted(path for path in ROOT.iterdir() if path.is_dir()):
        bounds = []
        collisions = []
        for layout in sorted(deck_dir.glob("slide-*.layout.json")):
            out, overlap = audit_layout(layout)
            if out:
                bounds.append({"slide": layout.stem, "items": out})
            if overlap:
                collisions.append({"slide": layout.stem, "items": overlap})
        sheet = contact_sheet(deck_dir)
        summary[deck_dir.name] = {
            "slides": len(list(deck_dir.glob("slide-*.png"))),
            "out_of_bounds": bounds,
            "text_collisions": collisions,
            "contact_sheet": str(sheet),
        }
    output = ROOT.parent / "deck_qa_report.json"
    output.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
