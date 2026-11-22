import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';

const font = (w: number) =>
  fs.readFileSync(path.resolve(`node_modules/@fontsource/inter/files/inter-latin-${w}-normal.woff`));

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

export const GET: APIRoute = async () => {
  const icon = (bg: string, label: string, color = '#fff') =>
    el('div', { width: 64, height: 64, borderRadius: 18, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 }, label);

  const phone = el(
    'div',
    { position: 'absolute', left: 810, top: 55, width: 300, height: 520, borderRadius: 52, background: '#05060a', padding: 12, display: 'flex', boxShadow: '0 0 0 2px #2a2f3c' },
    el('div', { flex: 1, borderRadius: 42, background: 'linear-gradient(160deg,#1c2340,#2a1b4d 55%,#0f2a3d)', display: 'flex', flexDirection: 'column', padding: 26, gap: 22 }, [
      el('div', { display: 'flex', flexDirection: 'column', padding: 18, borderRadius: 22, background: 'rgba(255,255,255,0.08)', color: '#fff' }, [
        el('div', { fontSize: 15, color: '#b9c0d4' }, 'Experience'),
        el('div', { fontSize: 36, fontWeight: 800 }, '5 yrs'),
      ]),
      el('div', { display: 'flex', flexWrap: 'wrap', gap: 14 }, [
        icon('#e1251b', 'S&S'), icon('#1f6bff', 'b'), icon('#ff8a00', 'K'),
        icon('#0b3d91', 'N'), icon('#ffd23f', 'ha', '#222'), icon('#3ddc97', 'F', '#063d25'),
      ]),
    ]),
  );

  const svg = await satori(
    el('div', { width: 1200, height: 630, display: 'flex', alignItems: 'center', position: 'relative', padding: '0 90px', fontFamily: 'Inter', color: '#e9ecf3',
      background: 'radial-gradient(900px 500px at 85% 10%, rgba(124,92,255,0.35), transparent 60%), radial-gradient(700px 400px at 0% 100%, rgba(84,197,248,0.2), transparent 60%), #0b0d12' }, [
      el('div', { display: 'flex', flexDirection: 'column', maxWidth: 640 }, [
        el('div', { fontSize: 26, color: '#8b93a7', marginBottom: 18 }, 'Mobile Application Developer'),
        el('div', { fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }, 'Ahmed Galal'),
        el('div', { fontSize: 34, marginTop: 26, backgroundImage: 'linear-gradient(90deg,#54c5f8,#7c5cff)', backgroundClip: 'text', color: 'transparent', fontWeight: 700 }, 'Flutter & Android · Cairo'),
      ]),
      phone,
    ]) as unknown as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: font(700), weight: 700, style: 'normal' },
        { name: 'Inter', data: font(800), weight: 800, style: 'normal' },
      ],
    },
  );
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
