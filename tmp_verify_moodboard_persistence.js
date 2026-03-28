const { chromium } = require('@playwright/test');

(async () => {
  const url = 'https://id-preview--9b84837d-6419-4ec0-9718-11ff934c61bf.lovable.app/moodboard.html';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 621 } });
  const page = await context.newPage();

  function pxNum(v){
    const n = parseFloat(String(v || '0').replace('px',''));
    return Number.isFinite(n) ? n : 0;
  }

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => typeof window.saveLayout === 'function' && typeof window.runItemRearrange === 'function' && document.querySelectorAll('#canvas > .sticker').length > 50, null, { timeout: 120000 });
  await page.waitForTimeout(1800);

  const targetSelector = '.zone-intro-card[data-zone="work"], .intro-card[data-zone="work"]';
  const exists = await page.$(targetSelector);
  if(!exists) throw new Error('Could not find target sticker for test');

  const savedPos = await page.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    const startL = parseFloat(el.style.left) || 0;
    const startT = parseFloat(el.style.top) || 0;
    const nextL = startL + 231;
    const nextT = startT + 141;
    el.style.left = nextL + 'px';
    el.style.top = nextT + 'px';
    await window.saveLayout();
    return {
      left: el.style.left,
      top: el.style.top,
      sync: document.getElementById('layoutSyncStatus')?.textContent || ''
    };
  }, targetSelector);

  await page.waitForTimeout(1800);

  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => typeof window.loadSavedLayout === 'function' && document.querySelectorAll('#canvas > .sticker').length > 50, null, { timeout: 120000 });
  await page.waitForTimeout(2600);

  const loaded = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      left: el ? el.style.left : '',
      top: el ? el.style.top : '',
      sync: document.getElementById('layoutSyncStatus')?.textContent || ''
    };
  }, targetSelector);

  const rearrangeResult = await page.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    const movedL = (parseFloat(el.style.left) || 0) + 377;
    const movedT = (parseFloat(el.style.top) || 0) + 209;
    el.style.left = movedL + 'px';
    el.style.top = movedT + 'px';
    await window.runItemRearrange(true);
    await new Promise(r => setTimeout(r, 900));
    return {
      left: el.style.left,
      top: el.style.top,
      btn: document.getElementById('rearrangeBtn')?.textContent || ''
    };
  }, targetSelector);

  const saveVsLoad = {
    leftDelta: Math.abs(pxNum(savedPos.left) - pxNum(loaded.left)),
    topDelta: Math.abs(pxNum(savedPos.top) - pxNum(loaded.top))
  };

  const loadVsRearrange = {
    leftDelta: Math.abs(pxNum(loaded.left) - pxNum(rearrangeResult.left)),
    topDelta: Math.abs(pxNum(loaded.top) - pxNum(rearrangeResult.top))
  };

  const passSaveReload = saveVsLoad.leftDelta < 1 && saveVsLoad.topDelta < 1;
  const passRearrangeRevert = loadVsRearrange.leftDelta < 1 && loadVsRearrange.topDelta < 1;

  console.log(JSON.stringify({
    passSaveReload,
    passRearrangeRevert,
    savedPos,
    loaded,
    rearrangeResult,
    saveVsLoad,
    loadVsRearrange
  }, null, 2));

  await browser.close();
})();
