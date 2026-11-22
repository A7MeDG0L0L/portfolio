// Regenerates public/cv/page-N.webp from public/cv/Ahmed-Galal-CV.pdf (macOS: uses PDFKit via swift).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-pages-'));
const out = execFileSync('swift', ['scripts/render-cv-pages.swift', 'public/cv/Ahmed-Galal-CV.pdf', tmp], { encoding: 'utf8' });
const pngs = fs.readdirSync(tmp).filter((f) => f.endsWith('.png')).sort();
for (const f of fs.readdirSync('public/cv').filter((f) => /^page-\d+\.webp$/.test(f))) fs.rmSync(path.join('public/cv', f));
for (const f of pngs) await sharp(path.join(tmp, f)).resize(1000).webp({ quality: 82 }).toFile(path.join('public/cv', f.replace('.png', '.webp')));
console.log(out.trim(), `\nwrote ${pngs.length} page(s) to public/cv/`);
