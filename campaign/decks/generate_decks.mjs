import fs from 'node:fs/promises';
import path from 'node:path';
import { Presentation, PresentationFile } from 'file:///C:/Users/angel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const ROOT = 'C:/Development/XAIHT/web-app';
const GALLERY = path.join(ROOT, 'campaign/assets/gallery');
const LOGO = path.join(ROOT, 'campaign/brand/logo/xaiht-tlamatini-lockup-2280.png');
const OUTPUT = path.join(ROOT, 'campaign/decks');
const W = 1280;
const H = 720;
const C = {
  obsidian: '#090B0C',
  panel: '#111516',
  panel2: '#171C1D',
  chalk: '#F2F3EE',
  muted: '#9CA5A1',
  line: '#303738',
  maize: '#D6A84B',
  jade: '#42A783',
  cyan: '#36B7D9',
  coral: '#E56855',
  iris: '#8B78D3',
};

async function bytes(file) {
  const data = await fs.readFile(file);
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
}

async function writeBlob(file, blob) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, new Uint8Array(await blob.arrayBuffer()));
}

function box(slide, x, y, w, h, fill = C.panel, line = C.line, radius = 4) {
  return slide.shapes.add({
    geometry: radius ? 'roundRect' : 'rect',
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: 'solid', fill: line, width: line === 'none' ? 0 : 1 },
    ...(radius ? { borderRadius: 'rounded-sm' } : {}),
  });
}

function text(slide, value, x, y, w, h, options = {}) {
  const shape = slide.shapes.add({
    geometry: 'textbox',
    name: options.name,
    position: { left: x, top: y, width: w, height: h },
    fill: 'none',
    line: { style: 'solid', fill: 'none', width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    fontFamily: options.fontFamily || 'Aptos',
    fontSize: options.size || 20,
    color: options.color || C.chalk,
    bold: options.bold || false,
    alignment: options.align || 'left',
    verticalAlignment: options.valign || 'top',
  };
  return shape;
}

function line(slide, x, y, w, color = C.line, weight = 1) {
  return slide.shapes.add({
    geometry: 'rect',
    position: { left: x, top: y, width: w, height: weight },
    fill: color,
    line: { style: 'solid', fill: color, width: 0 },
  });
}

async function image(slide, file, x, y, w, h, alt, fit = 'cover') {
  const ext = path.extname(file).toLowerCase();
  const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return slide.images.add({
    blob: await bytes(file),
    contentType,
    alt,
    fit,
    position: { left: x, top: y, width: w, height: h },
  });
}

function footer(slide, deck, number) {
  line(slide, 56, 681, 1168, C.line, 1);
  text(slide, 'XAIHT / TLAMATINI', 56, 688, 240, 18, { size: 9, bold: true, color: C.maize });
  text(slide, deck, 410, 688, 460, 18, { size: 9, color: C.muted, align: 'center' });
  text(slide, String(number).padStart(2, '0'), 1170, 688, 54, 18, { size: 9, color: C.muted, align: 'right' });
}

function header(slide, deck, number, kicker, title, subtitle = '') {
  slide.background.fill = C.obsidian;
  text(slide, kicker.toUpperCase(), 56, 40, 620, 22, { size: 10, bold: true, color: C.jade });
  text(slide, title, 56, 76, 1110, 72, { size: 34, bold: true, name: `slide-${number}-title` });
  if (subtitle) text(slide, subtitle, 56, 158, 1060, 38, { size: 16, color: C.muted });
  footer(slide, deck, number);
}

function source(slide, value) {
  text(slide, value, 56, 655, 1120, 20, { size: 8, color: '#727B77' });
}

function metric(slide, x, y, w, value, label, accent = C.maize) {
  box(slide, x, y, w, 128, C.panel, C.line, 4);
  text(slide, value, x + 18, y + 18, w - 36, 48, { size: 34, bold: true, color: accent });
  text(slide, label, x + 18, y + 75, w - 36, 38, { size: 12, color: C.muted });
}

function card(slide, x, y, w, h, titleValue, body, accent = C.cyan) {
  box(slide, x, y, w, h, C.panel, C.line, 4);
  box(slide, x, y, 5, h, accent, accent, 0);
  text(slide, titleValue, x + 22, y + 18, w - 42, 30, { size: 16, bold: true });
  text(slide, body, x + 22, y + 58, w - 42, h - 72, { size: 12, color: C.muted });
}

function bulletList(slide, items, x, y, w, options = {}) {
  const gap = options.gap || 52;
  items.forEach((item, index) => {
    const yy = y + index * gap;
    box(slide, x, yy + 3, 12, 12, options.accent || C.jade, options.accent || C.jade, 2);
    text(slide, item, x + 28, yy, w - 28, gap - 4, { size: options.size || 16, color: options.color || C.chalk });
  });
}

async function cover(pres, deckName, titleValue, subtitle, heroFile) {
  const slide = pres.slides.add();
  slide.background.fill = C.obsidian;
  await image(slide, heroFile, 0, 0, W, H, titleValue);
  box(slide, 0, 0, 650, H, C.obsidian, 'none', 0);
  box(slide, 650, 0, 140, H, C.panel, 'none', 0);
  await image(slide, LOGO, 58, 54, 430, 76, 'XAIHT Tlamatini logo', 'contain');
  text(slide, titleValue, 58, 226, 610, 190, { size: 46, bold: true });
  text(slide, subtitle, 58, 438, 540, 84, { size: 18, color: '#D5D9D5' });
  text(slide, 'JULY 2026', 58, 633, 180, 22, { size: 10, bold: true, color: C.maize });
  text(slide, deckName, 280, 633, 300, 22, { size: 10, color: C.muted });
  return slide;
}

async function createInvestorDeck() {
  const deck = 'INVESTOR BRIEF';
  const p = Presentation.create({ slideSize: { width: W, height: H } });
  await cover(p, deck, 'The human-commanded operations layer for builders', 'Tlamatini connects project intelligence, guarded action, creative engines, embedded hardware, and reusable workflows.', path.join(GALLERY, '01-command-the-whole-workspace.png'));

  let s = p.slides.add();
  header(s, deck, 2, 'Category shift', 'AI is moving beyond the chat box.', 'The valuable unit is no longer an answer. It is an inspectable action across the systems where work happens.');
  card(s, 56, 220, 260, 330, 'Coding agents', 'Deep code execution, but commonly optimized around repositories and software delivery.', C.cyan);
  card(s, 342, 220, 260, 330, 'Automation platforms', 'Broad business integrations, but often distant from project context, creative tools, and device work.', C.jade);
  card(s, 628, 220, 260, 330, 'Physical toolchains', 'Powerful engines and boards, but fragmented across specialists, commands, and local setup.', C.coral);
  card(s, 914, 220, 310, 330, 'The open space', 'A local-first operator that knows the project, crosses these surfaces, and keeps the human in command.', C.maize);

  s = p.slides.add();
  header(s, deck, 3, 'Problem', 'Builders still orchestrate the whole stack by hand.', 'Context is copied, approvals are implicit, successful sequences disappear, and each tool keeps a separate operational vocabulary.');
  const problemItems = [
    ['CONTEXT', 'Code, docs, credentials, and environment knowledge drift between tools.'],
    ['EXECUTION', 'Actions cross files, browsers, CLIs, engines, boards, and networks.'],
    ['GOVERNANCE', 'Teams need explicit approval, evidence, cancellation, and responsibility.'],
    ['REUSE', 'A successful run rarely becomes an editable operational asset.'],
  ];
  problemItems.forEach(([a, b], i) => {
    text(s, String(i + 1).padStart(2, '0'), 72, 235 + i * 92, 50, 36, { size: 22, bold: true, color: [C.maize,C.cyan,C.coral,C.jade][i] });
    text(s, a, 146, 232 + i * 92, 180, 26, { size: 12, bold: true, color: C.muted });
    text(s, b, 330, 226 + i * 92, 780, 48, { size: 17 });
    line(s, 146, 298 + i * 92, 970, C.line);
  });

  s = p.slides.add();
  header(s, deck, 4, 'Product thesis', 'Command the whole workspace.', 'Tlamatini is designed as the operating layer between human intent and a heterogeneous technical workspace.');
  await image(s, path.join(GALLERY, '01-command-the-whole-workspace.png'), 570, 205, 654, 410, 'Tlamatini and an engineer at a connected workspace');
  bulletList(s, ['Know the project with hybrid retrieval and source context.', 'Act across enabled tools, agents, skills, MCPs, and external CLIs.', 'Preserve human approval, reports, and hard cancellation.', 'Turn successful Multi-Turn work into visible .flw workflows.'], 72, 230, 440, { gap: 72, size: 17 });

  s = p.slides.add();
  header(s, deck, 5, 'Operating model', 'Know. Act. Capture.', 'The product compounds when a successful bounded action becomes a reusable, inspectable workflow.');
  const stages = [
    ['01', 'KNOW', 'Project files, retrieval, source maps, selected folders, and self-knowledge.'],
    ['02', 'ACT', 'Multi-Turn coordinates enabled tools with approvals and execution evidence.'],
    ['03', 'CAPTURE', 'The operator can preserve successful work as a .flw process for reuse.'],
  ];
  stages.forEach(([n,t,b], i) => {
    const x = 66 + i * 398;
    box(s, x, 230, 360, 310, i === 1 ? C.panel2 : C.panel, C.line, 4);
    text(s, n, x + 24, 250, 58, 36, { size: 24, bold: true, color: [C.maize,C.cyan,C.jade][i] });
    text(s, t, x + 24, 315, 260, 34, { size: 21, bold: true });
    text(s, b, x + 24, 375, 310, 110, { size: 16, color: C.muted });
    if (i < 2) text(s, '>', x + 367, 340, 25, 50, { size: 30, bold: true, color: C.line, align: 'center' });
  });

  s = p.slides.add();
  header(s, deck, 6, 'Current product', 'The breadth is already real; the commercial wedge is the next proof.', 'Live source inventory from the v1.41.3 repository snapshot, 15 July 2026.');
  metric(s, 56, 230, 260, '85', 'workflow agents', C.maize);
  metric(s, 342, 230, 260, '94', 'Multi-Turn tools', C.cyan);
  metric(s, 628, 230, 260, '27', 'inspectable skills', C.jade);
  metric(s, 914, 230, 310, '176,259', 'effective authored lines', C.iris);
  card(s, 56, 390, 360, 170, 'Local-first core', 'Django/Channels, SQLite, FAISS/BM25 retrieval, native project context, and MIT-licensed source.', C.jade);
  card(s, 444, 390, 360, 170, 'Cross-surface execution', 'Files, desktop, browser, engines, embedded toolchains, voice, media, messaging, and MCP.', C.cyan);
  card(s, 832, 390, 392, 170, 'Bounded operation', 'Ask Execs, Step-by-Step, execution reports, cancellation, and explicit user jurisdiction.', C.coral);
  source(s, 'Source: live Tlamatini generator collect_context(); git describe v1.41.3-1-gc7c3fa10-dirty.');

  s = p.slides.add();
  header(s, deck, 7, 'Crown jewels', 'Tlamatini reaches where software touches the real world.', 'Four high-value surfaces make the category concrete.');
  const jewels = [
    ['06-unreal-engine-studio.png', 'Unreal Engine', 'Direct control and one-prompt C++ project scaffolding.'],
    ['07-blender-product-studio.png', 'Blender', 'Editable scenes, materials, screenshots, and renders.'],
    ['09-stm32-robotics-bench.png', 'STM32er', 'Build, flash, observe, and preflight embedded work.'],
    ['10-esp32-smart-agriculture.png', 'ESP32er', 'PlatformIO firmware workflows tied to field evidence.'],
  ];
  for (let i = 0; i < jewels.length; i++) {
    const [file, titleValue, body] = jewels[i];
    const x = 56 + i * 292;
    await image(s, path.join(GALLERY, file), x, 220, 268, 188, titleValue);
    text(s, titleValue, x, 428, 268, 26, { size: 17, bold: true });
    text(s, body, x, 462, 268, 72, { size: 12, color: C.muted });
  }

  s = p.slides.add();
  header(s, deck, 8, 'Trust position', 'Capability is not permission.', 'Human command is a product principle and an explicit operating boundary.');
  await image(s, path.join(GALLERY, '04-approve-observe-cancel.png'), 56, 210, 590, 410, 'Human operator with approval and stop controls');
  card(s, 688, 220, 536, 92, 'INSPECT', 'See the planned action, selected tool, and operating context before execution.', C.cyan);
  card(s, 688, 330, 536, 92, 'APPROVE OR DENY', 'Ask Execs can pause state-changing work; Step-by-Step can pace setup.', C.jade);
  card(s, 688, 440, 536, 92, 'CANCEL AND REPORT', 'Hard cancellation and execution reporting preserve operator control and evidence.', C.coral);
  text(s, 'Plain-Python agents remain under the user’s jurisdiction and responsibility.', 688, 560, 500, 44, { size: 13, bold: true, color: C.maize });

  s = p.slides.add();
  header(s, deck, 9, 'Beachhead', 'Start with teams where one person already carries the whole system.', 'Technical founders, embedded teams, robotics labs, and creative-technology studios feel the integration tax most acutely.');
  const segments = [
    ['TECHNICAL FOUNDERS', 'Codebase + deployment + automation', 'Fastest path to a complete bounded workflow'],
    ['EMBEDDED / ROBOTICS', 'Firmware + instruments + observed motion', 'Distinctive proof beyond code-only agents'],
    ['CREATIVE TECHNOLOGY', 'Code + Unreal/Blender + assets', 'Visible outputs and repeatable production steps'],
  ];
  segments.forEach(([a,b,c],i) => card(s, 56 + i * 390, 230, 360, 300, a, `${b}\n\nLaunch hypothesis: ${c}`, [C.maize,C.jade,C.cyan][i]));
  text(s, 'Commercial discipline: select the primary vertical after measured activation, retention, support burden, and paid conversion.', 88, 565, 1080, 42, { size: 15, bold: true, color: C.coral, align: 'center' });

  s = p.slides.add();
  header(s, deck, 10, 'Offer design', 'Keep the MIT core open; sell implementation and trust.', 'Launch-now offers create revenue without pretending enterprise roadmap features already ship.');
  const offers = [
    ['Community', 'MIT source and public releases', 'CURRENT'],
    ['Launch Lab', 'Installation, model setup, workflow design, operator training', 'LAUNCH NOW'],
    ['Workflow Pack', 'Customer-specific .flw design and validation', 'LAUNCH NOW'],
    ['Integration Sprint', 'Unreal, Blender, STM32, ESP32, ESPHome, or Arduino support', 'LAUNCH NOW'],
    ['Readiness Review', 'Configuration, permissions, connector scope, and recovery', 'LAUNCH NOW'],
    ['Enterprise Layer', 'Signed channel, policy, fleet, identity, support SLAs', 'ROADMAP'],
  ];
  offers.forEach(([a,b,c],i) => {
    const col = i % 3; const row = Math.floor(i/3); const x = 56 + col * 390; const y = 220 + row * 190;
    const accent = c === 'ROADMAP' ? C.iris : (c === 'CURRENT' ? C.jade : C.maize);
    box(s, x, y, 360, 165, C.panel, C.line, 4);
    box(s, x, y, 5, 165, accent, accent, 0);
    text(s, a, x + 22, y + 18, 180, 30, { size: 16, bold: true });
    text(s, b, x + 22, y + 58, 318, 88, { size: 12, color: C.muted });
    text(s, c, x + 220, y + 18, 116, 22, { size: 9, bold: true, color: c === 'ROADMAP' ? C.iris : C.muted, align: 'right' });
  });

  s = p.slides.add();
  header(s, deck, 11, 'Go to market', 'Lead with reproducible proof, then convert expertise into engagements.', 'Every campaign claim should point to a demo, workflow file, build log, or bounded result.');
  const funnel = [
    ['PROOF', '3 hero demos', 'Unreal/Blender · robotics loop · project-to-workflow'],
    ['DESIGN', '10 partners', 'Embedded · creative technology · small engineering teams'],
    ['CONVERT', 'Paid services', 'Launch Lab · integration sprint · readiness review'],
    ['FOCUS', '1 vertical wedge', 'Choose by retention, revenue, margin, and repeatability'],
  ];
  funnel.forEach(([a,b,c],i) => {
    const x = 78 + i * 294; const width = 260;
    box(s, x, 245, width, 250, i === 3 ? C.panel2 : C.panel, [C.maize,C.cyan,C.jade,C.coral][i], 4);
    text(s, a, x + 20, 267, width - 40, 24, { size: 10, bold: true, color: [C.maize,C.cyan,C.jade,C.coral][i] });
    text(s, b, x + 20, 318, width - 40, 42, { size: 22, bold: true });
    text(s, c, x + 20, 385, width - 40, 80, { size: 13, color: C.muted });
  });

  s = p.slides.add();
  header(s, deck, 12, 'Market tailwinds', 'Exposure is broad; the winning systems will improve work without erasing agency.', 'External evidence supports the category need, not a claim of measured Tlamatini impact.');
  metric(s, 56, 230, 260, '1 in 4', 'workers in occupations with some GenAI exposure', C.maize);
  metric(s, 342, 230, 260, '+14%', 'average productivity in a customer-support field study', C.cyan);
  metric(s, 628, 230, 260, '2.2B', 'people still offline in 2025', C.coral);
  metric(s, 914, 230, 310, '~945 TWh', 'projected data-centre electricity demand in 2030', C.iris);
  text(s, 'Implication', 56, 410, 180, 30, { size: 12, bold: true, color: C.jade });
  text(s, 'Human-commanded, adaptable, local-first operating layers can capture productivity while making infrastructure, skills, and accountability visible.', 56, 450, 1040, 86, { size: 23, bold: true });
  source(s, 'Sources: ILO (2025); Brynjolfsson, Li & Raymond, NBER w31161; ITU Facts and Figures 2025; IEA Energy and AI (2025).');

  s = p.slides.add();
  header(s, deck, 13, 'Competitive position', 'Tlamatini occupies the bridge between code depth and real-world surface breadth.', 'Positioning is a strategic hypothesis; it is not a benchmark or market-share claim.');
  line(s, 185, 560, 900, C.line, 2); line(s, 185, 245, 2, C.line, 315);
  text(s, 'NARROW SURFACE', 120, 570, 180, 20, { size: 9, color: C.muted });
  text(s, 'BROAD SURFACE', 980, 570, 180, 20, { size: 9, color: C.muted, align: 'right' });
  text(s, 'HIGH PROJECT DEPTH', 68, 210, 120, 34, { size: 9, color: C.muted, align: 'right' });
  text(s, 'LOW PROJECT DEPTH', 56, 520, 132, 28, { size: 9, color: C.muted, align: 'right' });
  const dots = [
    ['Coding agents', 430, 300, C.cyan],
    ['Automation platforms', 770, 460, C.jade],
    ['Agent frameworks', 620, 390, C.iris],
    ['Tlamatini', 910, 285, C.maize],
  ];
  dots.forEach(([name,x,y,color]) => { box(s, x, y, 20, 20, color, color, 10); text(s, name, x + 28, y - 2, 190, 28, { size: 13, bold: name === 'Tlamatini', color }); });

  s = p.slides.add();
  header(s, deck, 14, 'Defensibility', 'The moat must become accumulated operational proof.', 'Breadth alone is replicable; trusted workflows, validated integrations, and retained operators compound.');
  card(s, 56, 220, 555, 150, 'Integration depth', 'Direct engine and hardware paths create hard-earned implementation knowledge.', C.cyan);
  card(s, 669, 220, 555, 150, 'Inspectable operating model', 'Readable agents, explicit user jurisdiction, and local-first context support trust.', C.jade);
  card(s, 56, 400, 555, 150, 'Workflow capture', 'Reusable .flw assets can encode customer-specific processes and operating evidence.', C.maize);
  card(s, 669, 400, 555, 150, 'Proof network', 'Demos, case studies, validated packs, and partner expertise become the real distribution advantage.', C.coral);

  s = p.slides.add();
  header(s, deck, 15, 'Illustrative capital plan', '$1.5M can fund 18 months of commercial proof.', 'Assumption for investor discussion, not a current financing commitment or forecast.');
  const uses = [
    ['45%', 'Product + reliability', C.cyan],
    ['25%', 'Design-partner delivery', C.jade],
    ['15%', 'Security + release trust', C.coral],
    ['10%', 'Developer marketing', C.maize],
    ['5%', 'Operations + legal', C.iris],
  ];
  uses.forEach(([pct,label,color],i) => {
    const y = 225 + i * 64;
    text(s, pct, 72, y, 80, 34, { size: 20, bold: true, color });
    box(s, 164, y + 5, Number.parseInt(pct) * 12, 22, color, color, 2);
    text(s, label, 730, y, 390, 34, { size: 15 });
  });
  box(s, 56, 568, 1168, 58, C.panel2, C.maize, 4);
  text(s, 'Milestone: 10 activated design partners, paid service conversion, one retained vertical wedge, and measured workflow reuse.', 82, 584, 1110, 28, { size: 15, bold: true, align: 'center' });

  s = p.slides.add();
  await slideClose(s, deck, 16, 'Invest in the proof, not the promise.', 'Tlamatini already demonstrates the breadth. The company-building task is to turn that breadth into a narrow, repeatable, trusted commercial system.', 'Build the human-commanded operations layer with us.', '00-tlamatini-master-reference.png');

  return p;
}

function slideClose(slide, deck, number, titleValue, body, callout, imageFile) {
  slide.background.fill = C.obsidian;
  return (async () => {
    await image(slide, path.join(GALLERY, imageFile), 0, 0, W, H, titleValue);
    box(slide, 0, 0, 790, H, C.obsidian, 'none', 0);
    text(slide, 'XAIHT / TLAMATINI', 58, 56, 260, 22, { size: 10, bold: true, color: C.maize });
    text(slide, titleValue, 58, 190, 650, 130, { size: 46, bold: true });
    text(slide, body, 58, 350, 610, 110, { size: 19, color: '#CDD2CE' });
    text(slide, callout, 58, 535, 620, 58, { size: 22, bold: true, color: C.jade });
    footer(slide, deck, number);
  })();
}

async function createCompetitionDeck() {
  const deck = 'COMPETITION / THREATS / OPPORTUNITIES';
  const p = Presentation.create({ slideSize: { width: W, height: H } });
  await cover(p, deck, 'Win the bridge, not the category war', 'A strategic assessment of coding agents, automation platforms, agent frameworks, and Tlamatini’s credible wedge.', path.join(GALLERY, '05-coordinate-frontier-agents.png'));

  let s = p.slides.add();
  header(s, deck, 2, 'Decision frame', 'Where can XAIHT win before incumbents absorb the feature set?', 'The answer must combine differentiated capability, customer pain, distribution, and a supportable operating model.');
  card(s, 56, 230, 360, 300, 'QUESTION 1', 'Which workflows require codebase context and real-world tool execution in the same bounded run?', C.cyan);
  card(s, 444, 230, 360, 300, 'QUESTION 2', 'Where does human-commanded local operation matter enough to affect purchase or adoption?', C.jade);
  card(s, 832, 230, 392, 300, 'QUESTION 3', 'Which wedge can produce paid, repeatable workflows before broad platforms close the gap?', C.maize);

  s = p.slides.add();
  header(s, deck, 3, 'Market structure', 'Three established categories converge on agentic work.', 'XAIHT should cooperate with them where possible and compete only where its cross-surface operating layer matters.');
  const cats = [
    ['CODING AGENTS', 'OpenAI Codex · Claude Code · GitHub Copilot · Cursor', 'Repository depth, software delivery, developer distribution', C.cyan],
    ['AUTOMATION PLATFORMS', 'n8n · Dify', 'Business connectors, workflow builders, deployment surfaces', C.jade],
    ['AGENT FRAMEWORKS', 'LangGraph and adjacent ecosystems', 'Programmable orchestration, state, evaluation, developer extensibility', C.iris],
  ];
  cats.forEach(([a,b,c,color],i) => card(s, 56 + i * 390, 220, 360, 320, a, `${b}\n\nCore advantage: ${c}`, color));
  source(s, 'Sources: official product and documentation pages listed in the campaign claims ledger.');

  s = p.slides.add();
  header(s, deck, 4, 'Coding agents', 'The strongest competitors own developer attention and repository workflows.', 'Their distribution and model quality are existential threats; their narrower physical-tool focus creates room.');
  const coding = [
    ['OpenAI Codex', 'Cloud coding agent ecosystem and strong model distribution', 'Partner through ACPX/MCP; do not compete on raw coding model quality'],
    ['Claude Code', 'Terminal-first coding and broad developer trust', 'Use as an external agent while Tlamatini supplies wider tool surfaces'],
    ['GitHub Copilot', 'Deep IDE and GitHub workflow distribution', 'Differentiate beyond code completion and repository operations'],
    ['Cursor', 'Agentic editor and background-agent workflow', 'Compete on local cross-surface orchestration, not editor ergonomics'],
  ];
  coding.forEach(([a,b,c],i) => {
    const y=215+i*98; text(s,a,66,y,210,34,{size:16,bold:true,color:C.cyan}); text(s,b,290,y,400,48,{size:13,color:C.muted}); text(s,c,720,y,470,48,{size:13}); line(s,66,y+70,1130,C.line);
  });
  source(s, 'Sources: OpenAI Codex, Anthropic Claude Code, GitHub Copilot, and Cursor official pages/documentation.');

  s = p.slides.add();
  header(s, deck, 5, 'Automation and frameworks', 'Workflow incumbents own connectors; frameworks own programmable orchestration.', 'XAIHT’s answer is integration depth across local project context, engines, devices, voice, and human command.');
  const auto = [
    ['n8n', 'Large workflow/connectors surface and AI-agent nodes', 'Hard to beat on general SaaS automation'],
    ['Dify', 'Open-source LLM application and workflow platform', 'Strong adjacent open-source distribution'],
    ['LangGraph', 'Stateful agent orchestration for developers', 'Powerful framework; more building block than packaged operator'],
  ];
  auto.forEach(([a,b,c],i) => card(s, 56+i*390,230,360,300,a,`${b}\n\nStrategic reading: ${c}`,[C.jade,C.maize,C.iris][i]));
  source(s, 'Sources: n8n AI Agents, Dify, and LangGraph official product pages.');

  s = p.slides.add();
  header(s, deck, 6, 'Wedge', 'XAIHT can own the moment software reaches an engine, board, instrument, or voice loop.', 'This is narrower than “all AI work” and broader than a code editor.');
  await image(s, path.join(GALLERY,'09-stm32-robotics-bench.png'),56,205,560,390,'Embedded robotics workbench');
  bulletList(s, ['Project-aware context before action', 'Direct Unreal, Blender, STM32, ESP32, ESPHome, and Arduino paths', 'Voice, image, video, desktop, browser, messaging, and external agents', 'Explicit approvals, execution evidence, and user jurisdiction', 'Successful work captured as reusable .flw orchestration'], 680,220,500,{gap:72,size:16,accent:C.maize});

  s = p.slides.add();
  header(s, deck, 7, 'Feature matrix', 'Tlamatini is differentiated by surface combination, not by winning every column.', 'Directional assessment based on public product positioning; verify during customer discovery.');
  const rows = [
    ['Repository coding depth', 'HIGH', 'MED', 'MED', 'MED-HIGH'],
    ['Business connectors', 'LOW-MED', 'HIGH', 'LOW', 'MED'],
    ['Creative engines', 'LOW', 'LOW', 'LOW', 'HIGH'],
    ['Embedded hardware', 'LOW', 'LOW-MED', 'LOW', 'HIGH'],
    ['Visual reusable flows', 'LOW-MED', 'HIGH', 'CODE', 'HIGH'],
    ['Human approval surface', 'VARIES', 'VARIES', 'CUSTOM', 'EXPLICIT'],
    ['Local-first project operator', 'VARIES', 'VARIES', 'CUSTOM', 'CORE'],
  ];
  const headers = ['Capability','Coding agents','Automation','Frameworks','Tlamatini'];
  const xs=[56,420,620,810,1000], ws=[350,180,170,170,224];
  headers.forEach((h,i)=>text(s,h,xs[i],205,ws[i],30,{size:11,bold:true,color:i===4?C.maize:C.muted,align:i? 'center':'left'}));
  rows.forEach((row,r)=>{
    const y=245+r*50; if(r%2===0) box(s,50,y-6,1174,44,C.panel,'none',0);
    row.forEach((v,i)=>text(s,v,xs[i],y,ws[i],28,{size:i===0?13:11,bold:i===4,color:i===4?C.maize:(i===0?C.chalk:C.muted),align:i?'center':'left'}));
  });
  source(s, 'Directional assessment from official public product descriptions; no benchmark or hands-on parity test is implied.');

  s = p.slides.add();
  header(s, deck, 8, 'Strengths', 'The current product already demonstrates unusual integration breadth.', 'These strengths become commercial only when packaged into reliable, repeatable outcomes.');
  card(s,56,220,360,145,'BREADTH','85 agents and 94 Multi-Turn tools across software, media, engines, devices, messaging, desktop, browser, and MCP.',C.cyan);
  card(s,444,220,360,145,'INSPECTABILITY','MIT core, readable Python agents, visible workflows, and source-grounded claims.',C.jade);
  card(s,832,220,392,145,'HUMAN COMMAND','Approval gates, Step-by-Step pacing, reports, cancellation, and explicit responsibility.',C.maize);
  card(s,56,395,360,145,'LOCAL-FIRST CONTEXT','Project retrieval and local application state reduce dependence on a single cloud surface.',C.iris);
  card(s,444,395,360,145,'PHYSICAL PROOF','Robotics, firmware, video verdicts, and engine outputs make demonstrations tangible.',C.coral);
  card(s,832,395,392,145,'ECOSYSTEM BRIDGE','ACPX and MCP allow external agents to become collaborators rather than only competitors.',C.cyan);

  s = p.slides.add();
  header(s, deck, 9, 'Weaknesses', 'Breadth creates reliability, onboarding, and support debt.', 'The strategy must narrow the promise before scaling the company.');
  const weaknesses=['No verified commercial traction or retained-use baseline yet','Many external dependencies, credentials, toolchains, and local environment assumptions','Broad test and documentation surface increases release burden','Windows-first installed experience limits initial platform reach','No shipped enterprise identity, fleet policy, signed channel, or formal support SLA','Brand must prove calm utility instead of looking like a generalized science-fiction assistant'];
  bulletList(s,weaknesses,76,215,1080,{gap:64,size:17,accent:C.coral});

  s = p.slides.add();
  header(s, deck, 10, 'Threats', 'Incumbents can copy features faster than XAIHT can copy distribution.', 'The response is focus, evidence, and interoperability.');
  const threats=[
    ['PLATFORM BUNDLING','Coding and cloud platforms add workflow, browser, desktop, and connector surfaces.','Win a vertical process before horizontal parity arrives.'],
    ['MODEL COMMODITIZATION','Base-model quality converges and reduces perceived product differentiation.','Make validated tool execution and workflow evidence the product.'],
    ['SECURITY INCIDENT','A powerful connector or modified agent causes harm or exposes private information.','Keep jurisdiction explicit; narrow scopes; publish incident and recovery discipline.'],
    ['SUPPORT OVERLOAD','Heterogeneous local setups consume founder time and erase service margin.','Standardize three hero stacks and refuse unsupported combinations.'],
  ];
  threats.forEach(([a,b,c],i)=>card(s,56+(i%2)*584,215+Math.floor(i/2)*185,552,160,a,`${b}\n\nResponse: ${c}`,C.coral));

  s = p.slides.add();
  header(s, deck, 11, 'Opportunities', 'Open-source distribution can turn specialist integrations into a trust network.', 'The highest-value opportunities pair visible proof with paid implementation.');
  card(s,56,220,360,300,'VERTICAL WORKFLOW PACKS','Validated packs for embedded bring-up, robotic verification, game-production steps, and operational readiness.',C.maize);
  card(s,444,220,360,300,'PARTNER-LED DELIVERY','Makerspaces, systems integrators, educators, and studios extend reach without centralizing every support burden.',C.jade);
  card(s,832,220,392,300,'HUMAN-COMMAND STANDARD','Publish practical patterns for approval, evidence, cancellation, credential scope, and agent responsibility.',C.cyan);

  s = p.slides.add();
  header(s, deck, 12, 'External signals', 'The market rewards augmentation, but access and infrastructure remain uneven.', 'This favors adaptable systems that expose constraints instead of hiding them.');
  metric(s,56,230,260,'25%','workers with some GenAI exposure',C.maize);
  metric(s,342,230,260,'34%','gain for novice/low-skilled workers in one field study',C.cyan);
  metric(s,628,230,260,'2.2B','people offline in 2025',C.coral);
  metric(s,914,230,310,'4 Cs','connectivity, compute, context, competency',C.jade);
  text(s,'Strategic consequence',56,420,240,28,{size:12,bold:true,color:C.iris});
  text(s,'Product value will vary sharply by region, sector, infrastructure, language context, and operator skill. XAIHT should measure local activation conditions as carefully as model quality.',56,458,1080,90,{size:21,bold:true});
  source(s,'Sources: ILO 2025; NBER w31161; ITU 2025; World Bank Digital Progress and Trends Report 2025.');

  s = p.slides.add();
  header(s, deck, 13, 'Scenarios', 'Three plausible futures require the same first move: prove a narrow workflow.', 'Planning horizon: 2026-2028. These are scenarios, not forecasts.');
  card(s,56,220,360,320,'A · PLATFORM ABSORPTION','Incumbents bundle most horizontal agent functions.\n\nXAIHT survives through specialist engine/device workflows, local deployment expertise, and interoperability.',C.coral);
  card(s,444,220,360,320,'B · OPEN ECOSYSTEM','Models and connectors commoditize while open agent standards grow.\n\nXAIHT becomes the human-commanded operating shell and workflow marketplace.',C.jade);
  card(s,832,220,392,320,'C · VERTICAL TRUST','Safety, sovereignty, and reliability push buyers toward bounded vertical systems.\n\nXAIHT wins with validated packs and operational readiness services.',C.maize);

  s = p.slides.add();
  header(s, deck, 14, '90-day response', 'Package three proofs and measure one commercial funnel.', 'The priority is learning velocity, not feature count.');
  const actions=[
    ['0-30','ALIGN','Ship the identity, claims ledger, security boundary, and three reproducible demos.'],
    ['31-60','ACTIVATE','Recruit 10 design partners; measure time to first bounded success and first saved workflow.'],
    ['61-90','CONVERT','Offer Launch Lab and integration sprints; measure paid conversion, delivery time, and margin.'],
  ];
  actions.forEach(([n,t,b],i)=>{const x=56+i*390; metric(s,x,225,360,n,t,[C.maize,C.cyan,C.jade][i]); text(s,b,x+18,375,324,115,{size:15,color:C.muted});});

  s = p.slides.add();
  header(s, deck, 15, 'Proof scorecard', 'A wedge is real only when operators repeat it and pay for it.', 'Use one scorecard across product, commercial, and trust outcomes.');
  const score=[
    ['ACTIVATION','Installer completion · time to first bounded action · setup interventions'],
    ['REUSE','Time to first saved .flw · workflows reused per active operator'],
    ['RETENTION','Weekly retained operators · second use case adopted'],
    ['ECONOMICS','Paid conversion · delivery hours · gross margin · support burden'],
    ['TRUST','Denied actions · cancel recovery · credential findings · incident severity'],
  ];
  score.forEach(([a,b],i)=>{const y=210+i*78;text(s,a,68,y,210,30,{size:12,bold:true,color:[C.maize,C.cyan,C.jade,C.iris,C.coral][i]});text(s,b,296,y,850,44,{size:16});line(s,68,y+54,1080,C.line);});

  s = p.slides.add();
  header(s, deck, 16, 'Ecosystem strategy', 'Turn major agents into tools inside the wider operating layer.', 'Interoperability reduces direct model competition and lets XAIHT focus on orchestration, physical surfaces, and trust.');
  const eco=[
    ['EXTERNAL CODING AGENTS','ACPX delegates to supported CLIs when the operator chooses.',C.cyan],
    ['MCP SERVERS','Universal transports connect third-party tools while expanding the attack surface.',C.jade],
    ['TLAMATINI OVER MCP','External clients can use enabled Tlamatini tools and agents.',C.maize],
    ['WORKFLOW PACKS','Validated .flw processes become the shared operational asset.',C.iris],
  ];
  eco.forEach(([a,b,color],i)=>card(s,56+(i%2)*584,220+Math.floor(i/2)*180,552,150,a,b,color));

  s = p.slides.add();
  header(s, deck, 17, 'Risk register', 'The highest risks are operational, not rhetorical.', 'Assign owners and evidence before scaling promotion.');
  const risks=[
    ['Security / privacy','HIGH','Scope controls, secret handling, release guards, incident response'],
    ['Integration reliability','HIGH','Three supported stacks, reproducible tests, dependency diagnostics'],
    ['Support economics','HIGH','Measure delivery hours, refuse unsupported combinations, partner network'],
    ['Platform competition','MED','Interoperate, focus vertical, accumulate workflow evidence'],
    ['Brand credibility','MED','Current counts, real demos, no fabricated traction, no autonomous fantasy'],
    ['Energy / access','MED','Measure local hardware, connectivity, model, and language constraints'],
  ];
  risks.forEach(([a,b,c],i)=>{const y=205+i*67;text(s,a,64,y,240,28,{size:14,bold:true});text(s,b,320,y,80,28,{size:12,bold:true,color:b==='HIGH'?C.coral:C.maize,align:'center'});text(s,c,430,y,750,42,{size:13,color:C.muted});line(s,64,y+46,1110,C.line);});

  s = p.slides.add();
  await slideClose(s, deck, 18, 'Focus the promise. Expand the proof.', 'Tlamatini should not challenge every coding agent or automation platform. It should become the trusted operator for workflows that cross code, engines, devices, media, and human approval.', 'Win one vertical workflow, then earn the right to widen.', '16-mexico-small-manufacturer.png');
  return p;
}

async function exportDeck(pres, stem) {
  const renderDir = path.join(OUTPUT, 'rendered', stem);
  await fs.mkdir(renderDir, { recursive: true });
  for (const [index, slide] of pres.slides.items.entries()) {
    const name = `slide-${String(index + 1).padStart(2, '0')}`;
    await writeBlob(path.join(renderDir, `${name}.png`), await pres.export({ slide, format: 'png', scale: 1 }));
    const layout = await slide.export({ format: 'layout' });
    await fs.writeFile(path.join(renderDir, `${name}.layout.json`), await layout.text());
  }
  await writeBlob(path.join(renderDir, 'montage.webp'), await pres.export({ format: 'webp', montage: true, scale: 0.5 }));
  const pptx = await PresentationFile.exportPptx(pres);
  await pptx.save(path.join(OUTPUT, `${stem}.pptx`));
}

async function main() {
  await fs.mkdir(OUTPUT, { recursive: true });
  const investor = await createInvestorDeck();
  const competition = await createCompetitionDeck();
  await exportDeck(investor, 'XAIHT_Tlamatini_Investor_Pitch');
  await exportDeck(competition, 'XAIHT_Competition_Threats_Opportunities');
  await fs.writeFile(path.join(OUTPUT, 'deck_manifest.json'), JSON.stringify({
    generated: new Date().toISOString(),
    investorSlides: investor.slides.items.length,
    competitionSlides: competition.slides.items.length,
    claimsSnapshot: '2026-07-15 / Tlamatini v1.41.3 / 85 agents / 94 Multi-Turn tools / 27 skills',
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
