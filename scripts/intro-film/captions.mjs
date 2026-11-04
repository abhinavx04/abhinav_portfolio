// Renders each film caption as a transparent 1920x1080 PNG, using the site's own Inter (loaded by the page).
import { chromium } from 'file:///H:/projects/abhinav_portfolio/node_modules/playwright/index.mjs';
const OUT = 'C:/Users/abhin/AppData/Local/Temp/claude/77855181fa97eb6a/b37ce5ac-5d4f-4cc2-984c-8563538902a5/scratchpad/caps';
import { mkdirSync } from 'node:fs';
mkdirSync(OUT, { recursive: true });
for (let i = 0; i < 40; i++) { try { await fetch('http://127.0.0.1:4402'); break; } catch { await new Promise(r => setTimeout(r, 500)); } }

const box = (bg, fg, size, pad) => `background:${bg};color:${fg};font-size:${size}px;padding:${pad};font-weight:900;line-height:1;letter-spacing:-0.01em;text-transform:uppercase;display:inline-block;white-space:nowrap`;
const CAPS = {
  city:     { css: 'left:112px;top:880px', html: '<span style="font-weight:600;font-size:40px;color:#fff;letter-spacing:0.02em;text-shadow:0 2px 12px rgba(0,0,0,.55)">BENGALURU &nbsp;·&nbsp; 02:00 AM</span>' },
  prod:     { css: 'left:556px;top:478px', html: `<span style="${box('#e84848', '#fff', 92, '16px 22px 14px')}">Prod is down.</span>` },
  director: { css: 'left:90px;top:810px',  html: `<span style="${box('#ededed', '#0b0b0f', 56, '13px 16px 11px')}">The Director</span>` },
  thinker:  { css: 'left:90px;top:810px',  html: `<span style="${box('#d97757', '#1a1a1a', 56, '13px 16px 11px')}">The Thinker</span>` },
  speedster:{ css: 'left:90px;top:810px',  html: `<span style="${box('#8b5cf6', '#fff', 56, '13px 16px 11px')}">The Speedster</span>` },
  deployed: { css: 'left:0;right:0;top:459px;text-align:center', html: `<span style="${box('#28c858', '#0b0b0f', 120, '18px 30px 16px')}">Deployed<svg width="0.78em" height="0.78em" viewBox="0 0 24 24" style="display:inline-block;margin-left:0.28em;vertical-align:-0.04em" fill="none" stroke="#0b0b0f" stroke-width="4.2" stroke-linecap="square"><path d="M3.5 12.5l5.5 5.5L20.5 6.5"/></svg></span>` },
  genius:   { css: 'left:0;right:0;top:855px;text-align:center', html: `<span style="${box('#080808', '#fff', 54, '11px 16px 9px')}">They make me look like a genius.</span>` },
  prompts:  { css: 'left:0;right:0;top:855px;text-align:center', html: `<span style="${box('#d97757', '#1a1a1a', 54, '11px 16px 9px')}">…but who wrote the prompts?</span>` },
};

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://127.0.0.1:4402/?intro=skip');
await page.evaluate(() => document.fonts.ready);
for (const [name, c] of Object.entries(CAPS)) {
  await page.evaluate(({ css, html }) => {
    document.body.innerHTML = `<div id="cap" style="position:fixed;inset:0;font-family:var(--font-inter),Inter,sans-serif"><div style="position:absolute;${css}">${html}</div></div>`;
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
  }, c);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/${name}.png`, omitBackground: true });
  console.log('rendered', name);
}
await browser.close();
