import { test } from '@playwright/test';
import path from 'path';

test.use({ channel: 'msedge', viewport: { width: 1280, height: 800 } });

test('capturar momentos de scroll e posições de cursor', async ({ page }) => {
  const fileUrl = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Momento 1: Topo do Hero com cursor sobre o CTA primário
  await page.mouse.move(180, 720);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshots/momento_1_hero_cursor_cta.png' });

  // Momento 2: Rolagem média no Hero (percurso da planta sendo desenhado pelo scroll)
  await page.evaluate(() => window.scrollTo(0, 380));
  await page.waitForTimeout(400);
  await page.mouse.move(800, 350); // cursor explorando a planta baixa
  await page.screenshot({ path: 'screenshots/momento_2_hero_scroll_tracado.png' });

  // Momento 3: Seção Serviços Pinned - Ato 01 (VPPB / Quarto que gira)
  await page.evaluate(() => {
    const el = document.querySelector('#servicos');
    if (el) window.scrollTo(0, el.offsetTop + 180);
  });
  await page.waitForTimeout(500);
  await page.mouse.move(300, 380);
  await page.screenshot({ path: 'screenshots/momento_3_servicos_ato1_vppb.png' });

  // Momento 4: Seção Serviços Pinned - Ato 02 (Andar pela casa sem medo / Prevenção de Quedas)
  await page.evaluate(() => {
    const el = document.querySelector('#servicos');
    if (el) window.scrollTo(0, el.offsetTop + 850);
  });
  await page.waitForTimeout(500);
  await page.mouse.move(850, 420); // cursor sobre a ilustração de perspectiva
  await page.screenshot({ path: 'screenshots/momento_4_servicos_ato2_quedas.png' });

  // Momento 5: Seção Serviços Pinned - Ato 03 (Osteopatia domiciliar)
  await page.evaluate(() => {
    const el = document.querySelector('#servicos');
    if (el) window.scrollTo(0, el.offsetTop + 1550);
  });
  await page.waitForTimeout(500);
  await page.mouse.move(320, 520);
  await page.screenshot({ path: 'screenshots/momento_5_servicos_ato3_osteo.png' });

  // Momento 6: Seção Sobre (Retrato, credenciais, cursor sobre citação)
  await page.evaluate(() => {
    const el = document.querySelector('#sobre');
    if (el) window.scrollTo(0, el.offsetTop);
  });
  await page.waitForTimeout(500);
  await page.mouse.move(700, 360);
  await page.screenshot({ path: 'screenshots/momento_6_sobre_credenciais.png' });

  // Momento 7: Seção Contato (WhatsApp principal e passos com cursor sobre botão)
  await page.evaluate(() => {
    const el = document.querySelector('#contato');
    if (el) window.scrollTo(0, el.offsetTop);
  });
  await page.waitForTimeout(500);
  await page.mouse.move(360, 580);
  await page.screenshot({ path: 'screenshots/momento_7_contato_whatsapp.png' });
});
