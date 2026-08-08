from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.graphics.shapes import Drawing, Line, Rect, String
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(r"C:\Development\XAIHT\web-app")
SOURCE = ROOT / "campaign" / "paper" / "Tlamatini_Global_Regional_Impact.md"
OUTPUT = ROOT / "campaign" / "paper" / "Tlamatini_Global_Regional_Impact.pdf"
GALLERY = ROOT / "campaign" / "assets" / "gallery"

OBSIDIAN = colors.HexColor("#090B0C")
PANEL = colors.HexColor("#111516")
CHALK = colors.HexColor("#F2F3EE")
INK = colors.HexColor("#1D2524")
MUTED = colors.HexColor("#65706C")
LINE = colors.HexColor("#D4DAD6")
MAIZE = colors.HexColor("#D6A84B")
JADE = colors.HexColor("#42A783")
CYAN = colors.HexColor("#36B7D9")
CORAL = colors.HexColor("#E56855")
IRIS = colors.HexColor("#8B78D3")

PAGE_W, PAGE_H = A4
MARGIN_X = 19 * mm
BODY_TOP = 20 * mm
BODY_BOTTOM = 18 * mm


class ImpactDoc(BaseDocTemplate):
    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph):
            name = getattr(flowable.style, "name", "")
            text = flowable.getPlainText()
            if name == "PaperH1":
                self.canv.bookmarkPage(text)
                self.canv.addOutlineEntry(text, text, level=0, closed=False)
            elif name == "PaperH2":
                key = f"h2-{self.page}-{abs(hash(text))}"
                self.canv.bookmarkPage(key)
                self.canv.addOutlineEntry(text, key, level=1, closed=True)


def cover_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(OBSIDIAN)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    hero = GALLERY / "16-mexico-small-manufacturer.png"
    if not hero.exists():
        hero = GALLERY / "00-tlamatini-master-reference.png"
    canvas.drawImage(str(hero), PAGE_W * 0.43, 0, PAGE_W * 0.57, PAGE_H, preserveAspectRatio=False, mask="auto")
    canvas.setFillColor(colors.Color(9 / 255, 11 / 255, 12 / 255, alpha=0.95))
    canvas.rect(0, 0, PAGE_W * 0.56, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(MAIZE)
    canvas.rect(0, PAGE_H - 8 * mm, PAGE_W, 8 * mm, fill=1, stroke=0)
    canvas.restoreState()


def body_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, PAGE_H - 13 * mm, PAGE_W - MARGIN_X, PAGE_H - 13 * mm)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(MAIZE)
    canvas.drawString(MARGIN_X, PAGE_H - 10.2 * mm, "XAIHT / TLAMATINI")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 10.2 * mm, "PROSPECTIVE IMPACT ASSESSMENT")
    canvas.line(MARGIN_X, 12 * mm, PAGE_W - MARGIN_X, 12 * mm)
    canvas.drawString(MARGIN_X, 8.2 * mm, "Evidence snapshot: 15 July 2026")
    canvas.drawRightString(PAGE_W - MARGIN_X, 8.2 * mm, str(doc.page))
    canvas.restoreState()


def styles():
    sample = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle("CoverKicker", fontName="Helvetica-Bold", fontSize=9, leading=11, textColor=JADE, spaceAfter=10),
        "cover_title": ParagraphStyle("CoverTitle", fontName="Helvetica-Bold", fontSize=29, leading=31, textColor=CHALK, spaceAfter=14),
        "cover_subtitle": ParagraphStyle("CoverSubtitle", fontName="Helvetica", fontSize=12.5, leading=18, textColor=colors.HexColor("#D4D9D5"), spaceAfter=16),
        "cover_meta": ParagraphStyle("CoverMeta", fontName="Helvetica", fontSize=8.5, leading=13, textColor=colors.HexColor("#AAB2AE")),
        "h1": ParagraphStyle("PaperH1", parent=sample["Heading1"], fontName="Helvetica-Bold", fontSize=19, leading=23, textColor=INK, spaceBefore=13, spaceAfter=8, keepWithNext=True),
        "h2": ParagraphStyle("PaperH2", parent=sample["Heading2"], fontName="Helvetica-Bold", fontSize=13.5, leading=17, textColor=INK, spaceBefore=10, spaceAfter=5, keepWithNext=True),
        "h3": ParagraphStyle("PaperH3", parent=sample["Heading3"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=JADE, spaceBefore=8, spaceAfter=4, keepWithNext=True),
        "body": ParagraphStyle("PaperBody", parent=sample["BodyText"], fontName="Helvetica", fontSize=9.2, leading=13.4, textColor=INK, spaceAfter=6.2, alignment=TA_LEFT),
        "abstract": ParagraphStyle("PaperAbstract", parent=sample["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14.2, textColor=INK, leftIndent=8 * mm, rightIndent=8 * mm, spaceAfter=7),
        "bullet": ParagraphStyle("PaperBullet", parent=sample["BodyText"], fontName="Helvetica", fontSize=9.1, leading=13, leftIndent=5 * mm, firstLineIndent=-3.5 * mm, bulletIndent=1 * mm, textColor=INK, spaceAfter=3),
        "number": ParagraphStyle("PaperNumber", parent=sample["BodyText"], fontName="Helvetica", fontSize=9.1, leading=13, leftIndent=7 * mm, firstLineIndent=-5 * mm, textColor=INK, spaceAfter=3),
        "caption": ParagraphStyle("PaperCaption", fontName="Helvetica", fontSize=7.6, leading=10.2, textColor=MUTED, spaceBefore=3, spaceAfter=8),
        "reference": ParagraphStyle("PaperReference", fontName="Helvetica", fontSize=8.2, leading=11.5, textColor=INK, leftIndent=5 * mm, firstLineIndent=-5 * mm, spaceAfter=5),
    }


def inline_markup(value: str) -> str:
    value = html.escape(value)
    value = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"\*(.+?)\*", r"<i>\1</i>", value)
    value = re.sub(r"`(.+?)`", r"<font name='Courier'>\1</font>", value)
    value = re.sub(
        r"(https?://[^\s<]+)",
        lambda match: f"<link href='{match.group(1)}' color='#237F72'>{match.group(1)}</link>",
        value,
    )
    return value


def theory_drawing():
    drawing = Drawing(460, 118)
    labels = ["CONTEXT", "BOUNDED\nACTION", "HUMAN\nCOMMAND", "WORKFLOW\nCAPTURE", "DIFFUSION"]
    colors_list = [CYAN, MAIZE, CORAL, JADE, IRIS]
    x_positions = [0, 94, 188, 282, 376]
    for index, (label, x, color) in enumerate(zip(labels, x_positions, colors_list)):
        drawing.add(Rect(x, 28, 78, 62, 3, 3, fillColor=PANEL, strokeColor=color, strokeWidth=1.2))
        parts = label.split("\n")
        if len(parts) == 1:
            drawing.add(String(x + 39, 56, parts[0], fontName="Helvetica-Bold", fontSize=7.5, fillColor=CHALK, textAnchor="middle"))
        else:
            drawing.add(String(x + 39, 61, parts[0], fontName="Helvetica-Bold", fontSize=7.3, fillColor=CHALK, textAnchor="middle"))
            drawing.add(String(x + 39, 48, parts[1], fontName="Helvetica-Bold", fontSize=7.3, fillColor=CHALK, textAnchor="middle"))
        if index < 4:
            drawing.add(Line(x + 78, 59, x + 92, 59, strokeColor=MUTED, strokeWidth=1.3))
    drawing.add(String(230, 103, "A capability becomes impact only when every link holds.", fontName="Helvetica-Bold", fontSize=9.2, fillColor=INK, textAnchor="middle"))
    return drawing


def evidence_drawing():
    drawing = Drawing(460, 155)
    items = [
        ("Bounded task productivity", 390, JADE, "causal evidence exists"),
        ("Skill diffusion", 310, CYAN, "plausible, context dependent"),
        ("Firm-level performance", 220, MAIZE, "requires longitudinal evidence"),
        ("Regional development", 120, CORAL, "scenario only"),
    ]
    drawing.add(String(0, 140, "EVIDENCE CALIBRATION", fontName="Helvetica-Bold", fontSize=8.5, fillColor=INK))
    for index, (label, width, color, note) in enumerate(items):
        y = 107 - index * 30
        drawing.add(String(0, y + 5, label, fontName="Helvetica", fontSize=7.8, fillColor=INK))
        drawing.add(Rect(145, y, width * 0.62, 14, 2, 2, fillColor=color, strokeColor=None))
        drawing.add(String(154 + width * 0.62, y + 3, note, fontName="Helvetica", fontSize=6.8, fillColor=MUTED))
    return drawing


def infrastructure_drawing():
    drawing = Drawing(460, 170)
    drawing.add(String(0, 155, "ACCESS AND ENERGY CONSTRAINTS", fontName="Helvetica-Bold", fontSize=8.5, fillColor=INK))
    drawing.add(String(0, 130, "People online / offline in 2025", fontName="Helvetica-Bold", fontSize=7.5, fillColor=INK))
    drawing.add(Rect(0, 96, 270, 22, 2, 2, fillColor=JADE, strokeColor=None))
    drawing.add(Rect(270, 96, 99, 22, 2, 2, fillColor=CORAL, strokeColor=None))
    drawing.add(String(8, 102, "6.0B online", fontName="Helvetica-Bold", fontSize=8, fillColor=CHALK))
    drawing.add(String(278, 102, "2.2B offline", fontName="Helvetica-Bold", fontSize=8, fillColor=CHALK))
    drawing.add(String(0, 70, "Data-centre electricity demand", fontName="Helvetica-Bold", fontSize=7.5, fillColor=INK))
    drawing.add(Rect(0, 38, 162, 20, 2, 2, fillColor=CYAN, strokeColor=None))
    drawing.add(String(8, 44, "2024  |  415 TWh", fontName="Helvetica-Bold", fontSize=8, fillColor=CHALK))
    drawing.add(Rect(0, 8, 369, 20, 2, 2, fillColor=IRIS, strokeColor=None))
    drawing.add(String(8, 14, "2030 base case  |  about 945 TWh", fontName="Helvetica-Bold", fontSize=8, fillColor=CHALK))
    drawing.add(String(382, 100, "ITU", fontName="Helvetica-Bold", fontSize=8, fillColor=MUTED))
    drawing.add(String(382, 18, "IEA", fontName="Helvetica-Bold", fontSize=8, fillColor=MUTED))
    return drawing


def snapshot_table(style):
    data = [
        ["Verified product snapshot", "Value", "Meaning"],
        ["Release", "v1.41.3", "Live source/tag resolution"],
        ["Workflow agents", "85", "Plain-Python agent programs"],
        ["Multi-Turn tools", "94", "62 wrapped + 20 core + 12 ACPX/skill"],
        ["Skills", "27", "Inspectable SKILL.md playbooks"],
        ["Effective authored lines", "176,259", "Generator-derived source inventory"],
    ]
    table = Table(data, colWidths=[50 * mm, 30 * mm, 84 * mm], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), OBSIDIAN),
        ("TEXTCOLOR", (0, 0), (-1, 0), CHALK),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.8),
        ("TEXTCOLOR", (0, 1), (-1, -1), INK),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F3F6F4")]),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return KeepTogether([table, Paragraph("Table 1. Product counts describe the current technical surface, not adoption or impact.", style["caption"])])


def regional_table(style):
    data = [
        ["Region", "High-fit opportunity", "Principal binding constraints"],
        ["North America", "Robotics, creative tech, technical founders", "Incumbent distribution, procurement, security maturity"],
        ["Latin America / Caribbean", "SMEs, agritech, creative studios, education", "Compute cost, uneven infrastructure, local support"],
        ["Europe / Central Asia", "Industrial, research, accountable assistive workflows", "Compliance, conformity, procurement"],
        ["East Asia / Pacific", "Electronics, manufacturing, simulation, education", "Competition, localization, heterogeneous connectivity"],
        ["South Asia", "Engineering SMEs, maker labs, devices, training", "Power, language, compute, formal/informal divide"],
        ["Sub-Saharan Africa", "Locally led energy, agriculture, sensing, education", "Connectivity, power, hardware, maintenance capacity"],
        ["Middle East / North Africa", "Energy, industry, creative media, education", "Country variation, Arabic context, data policy"],
    ]
    wrapped = [[Paragraph(inline_markup(cell), style["body"]) for cell in row] for row in data]
    table = Table(wrapped, colWidths=[34 * mm, 66 * mm, 64 * mm], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), OBSIDIAN),
        ("TEXTCOLOR", (0, 0), (-1, 0), CHALK),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 7.7),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F3F6F4")]),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return KeepTogether([table, Paragraph("Table 2. Opportunity is conditional and country-specific; entries are hypotheses for field evaluation.", style["caption"])])


def photo_pair(files, captions, style):
    cells = []
    for file in files:
        img = Image(str(GALLERY / file), width=79 * mm, height=49 * mm)
        cells.append(img)
    table = Table([cells], colWidths=[82 * mm, 82 * mm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    caption = Paragraph(f"Figure. {captions[0]} {captions[1]}", style["caption"])
    return KeepTogether([table, caption])


def parse_markdown(style):
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    story = []
    in_abstract = False
    in_references = False
    paragraph_buffer = []

    def flush():
        if not paragraph_buffer:
            return
        raw = " ".join(paragraph_buffer).strip()
        paragraph_buffer.clear()
        if not raw:
            return
        target = style["reference"] if in_references else (style["abstract"] if in_abstract else style["body"])
        story.append(Paragraph(inline_markup(raw), target))

    for raw_line in lines:
        line_value = raw_line.strip()
        if not line_value:
            flush()
            continue
        if line_value.startswith("# "):
            continue
        if line_value.startswith("## "):
            flush()
            heading = line_value[3:]
            in_abstract = heading == "Abstract"
            in_references = heading == "References"
            story.append(Paragraph(inline_markup(heading), style["h1"]))
            if heading.startswith("4. Conceptual framework"):
                story.append(theory_drawing())
                story.append(Paragraph("Figure 1. Proposed theory of change. Each transition is a testable condition rather than an assumed effect.", style["caption"]))
            if heading.startswith("6. Regional opportunity"):
                story.append(regional_table(style))
            if heading.startswith("9. Energy"):
                story.append(infrastructure_drawing())
                story.append(Paragraph("Figure 2. Connectivity and energy constraints. Sources: ITU Facts and Figures 2025; IEA Energy and AI 2025.", style["caption"]))
            continue
        if line_value.startswith("### "):
            flush()
            heading = line_value[4:]
            story.append(Paragraph(inline_markup(heading), style["h2"]))
            if heading == "3.1 Product evidence":
                story.append(snapshot_table(style))
            if heading == "3.4 Limits of inference":
                story.append(evidence_drawing())
                story.append(Paragraph("Figure 3. The evidence weakens as inference moves from bounded tasks to regional development.", style["caption"]))
            if heading == "5.5 Embedded systems, robotics, and local problem solving":
                files = ["09-stm32-robotics-bench.png", "10-esp32-smart-agriculture.png"]
                if all((GALLERY / file).exists() for file in files):
                    story.append(photo_pair(files, ["Embedded validation links code to instruments.", "Field deployments require local experts and real sensor evidence."], style))
            if heading == "6.6 Sub-Saharan Africa":
                file = GALLERY / "17-east-africa-solar-field-station.png"
                if file.exists():
                    story.append(KeepTogether([Image(str(file), width=164 * mm, height=92 * mm), Paragraph("Figure 4. Campaign scenario: locally led microgrid maintenance. The image is illustrative, not evidence of a deployment.", style["caption"])]))
            continue
        if line_value.startswith("**") and line_value.endswith("**"):
            flush()
            story.append(Paragraph(inline_markup(line_value), style["body"]))
            continue
        if line_value.startswith("- "):
            flush()
            story.append(Paragraph(inline_markup(line_value[2:]), style["bullet"], bulletText="-"))
            continue
        numbered = re.match(r"^(\d+)\.\s+(.+)$", line_value)
        if numbered:
            flush()
            story.append(Paragraph(f"<b>{numbered.group(1)}.</b> {inline_markup(numbered.group(2))}", style["number"]))
            continue
        paragraph_buffer.append(line_value)
    flush()
    return story


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    style = styles()
    cover_frame = Frame(MARGIN_X, 24 * mm, PAGE_W * 0.49 - MARGIN_X, PAGE_H - 50 * mm, id="cover-frame", showBoundary=0)
    body_frame = Frame(MARGIN_X, BODY_BOTTOM, PAGE_W - 2 * MARGIN_X, PAGE_H - BODY_TOP - BODY_BOTTOM, id="body-frame", showBoundary=0)
    doc = ImpactDoc(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=BODY_TOP,
        bottomMargin=BODY_BOTTOM,
        title="Human-Commanded Agentic Operations and the Diffusion of Applied AI",
        author="XAIHT",
        subject="Prospective global and regional impact assessment of Tlamatini",
    )
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[cover_frame], onPage=cover_page),
        PageTemplate(id="body", frames=[body_frame], onPage=body_page),
    ])
    story = [
        Spacer(1, 24 * mm),
        Paragraph("XAIHT RESEARCH / PROSPECTIVE ASSESSMENT", style["cover_kicker"]),
        Paragraph("Human-Commanded Agentic Operations and the Diffusion of Applied AI", style["cover_title"]),
        Paragraph("A prospective global and regional impact assessment of XAIHT Tlamatini", style["cover_subtitle"]),
        Paragraph("Evidence snapshot: 15 July 2026<br/>Product snapshot: Tlamatini v1.41.3<br/>Status: scenarios and research hypotheses, not measured population-level outcomes", style["cover_meta"]),
        NextPageTemplate("body"),
        PageBreak(),
    ]
    story.extend(parse_markdown(style))
    doc.build(story)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    build()
