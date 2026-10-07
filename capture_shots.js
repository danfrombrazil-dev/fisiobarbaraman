const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  console.log('Navegando para:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Meio do Hero (traçado em progresso, dot avançando)
  await page.evaluate(() => window.scrollTo(0, 320));
  await page.waitForTimeout(400);
  await page.mouse.move(500, 300);
  await page.screenshot({ path: 'screenshots/01_hero_scroll_tracado.png' });

  // 2. Início da seção de serviços - Ato 01 (VPPB / O Quarto que Gira)
  await page.evaluate(() => {
    const servicos = document.querySelector('#servicos');
    if (servicos) {
      window.scrollTo(0, servicos.offsetTop + 150);
    }
  });
  await page.waitForTimeout(600);
  await page.mouse.move(300, 400);
  await page.screenshot({ path: 'screenshots/02_servicos_ato1_vppb.png' });

  // 3. Meio da seção de serviços pinada - Ato 02 (Prevenção de Quedas / Corredor)
  await page.evaluate(() => {
    const servicos = document.querySelector('#servicos');
    if (servicos) {
      window.scrollTo(0, servicos.offsetTop + (servicos.offsetHeight * 0.45));
    }
  });
  await page.waitForTimeout(600);
  await page.mouse.move(850, 450);
  await page.screenshot({ path: 'screenshots/03_servicos_ato2_quedas.png' });

  // 4. Seção Sobre (Retrato + Credenciais)
  await page.evaluate(() => {
    const sobre = document.querySelector('#sobre');
    if (sobre) {
      window.scrollTo(0, sobre.offsetTop);
    }
  });
  await page.waitForTimeout(600);
  await page.mouse.move(400, 500);
  await page.screenshot({ path: 'screenshots/04_secao_sobre.png' });

  // 5. Seção Contato / Agendamento WhatsApp
  await page.evaluate(() => {
    const contato = document.querySelector('#contato');
    if (contato) {
      window.scrollTo(0, contato.offsetTop);
    }
  });
  await page.waitForTimeout(600);
  await page.mouse.move(250, 600);
  await page.screenshot({ path: 'screenshots/05_secao_contato.png' });

  console.log('Screenshots capturados com sucesso!');
  await browser.close();
})();
