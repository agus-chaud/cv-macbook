import { expect, test } from '@playwright/test';
import { enter } from './helpers';
import { LINKS } from '../../src/content/links';

// GitHub ya no es un enlace: abre su ventana de repositorios (C-01, tests/e2e/c-01-github.spec.ts).
// Los accesos salen de src/content/links.ts: los opcionales que no se usan (newsletter, WhatsApp) no deben aparecer.
const SHORTCUTS = LINKS.filter((l) => l.id !== 'github');
const UNUSED = (['newsletter', 'linkedin', 'whatsapp'] as const).filter((id) => !SHORTCUTS.some((l) => l.id === id));
const linkedin = SHORTCUTS.find((l) => l.id === 'linkedin');
const whatsapp = SHORTCUTS.find((l) => l.id === 'whatsapp');

test.describe('M-07 Accesos directos externos', () => {
  test.beforeEach(async ({ page, context }) => {
    // Los tests no salen a internet: las webs externas se sustituyen por una página vacía.
    for (const host of new Set([...LINKS.map((l) => new URL(l.url).host), 'example.com', 'github.com', 'www.linkedin.com', 'wa.me'])) {
      await context.route(`https://${host}/**`, (route) => route.fulfill({ status: 200, body: 'ok' }));
    }
    await enter(page);
  });

  test('los accesos externos apuntan a su web y se abren en una pestaña nueva', async ({ page }) => {
    expect(SHORTCUTS.length).toBeGreaterThan(0);
    for (const { id, url } of SHORTCUTS) {
      const link = page.getByTestId(`desktop-icon-${id}`);
      await expect(link).toBeVisible();
      expect(new URL((await link.getAttribute('href'))!).href).toBe(new URL(url).href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('los accesos opcionales que no se usan no salen en el escritorio', async ({ page }) => {
    await expect(page.getByTestId('desktop-icon-about')).toBeVisible();
    for (const id of UNUSED) await expect(page.getByTestId(`desktop-icon-${id}`), id).toHaveCount(0);
  });

  test('cada acceso muestra el icono de su servicio y la imagen carga', async ({ page }) => {
    for (const id of [...SHORTCUTS.map((s) => s.id), 'github']) {
      const img = page.getByTestId(`desktop-icon-${id}`).locator('img');
      await expect(img).toHaveAttribute('src', new RegExp(`^/links/.+\\.png$`));
      await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth), id).toBeGreaterThan(0);
    }
  });

  test('un solo clic selecciona y no abre la web', async ({ page, context }) => {
    const first = SHORTCUTS[0];
    let opened = false;
    context.on('page', () => (opened = true));
    await page.getByTestId(`desktop-icon-${first.id}`).click();
    await page.waitForTimeout(500);
    expect(opened).toBe(false);
    expect(new URL(page.url()).pathname).toBe('/');
  });

  test('doble clic abre la web en una pestaña nueva', async ({ page, context }) => {
    const target = linkedin ?? SHORTCUTS[0];
    const [tab] = await Promise.all([context.waitForEvent('page'), page.getByTestId(`desktop-icon-${target.id}`).dblclick()]);
    await tab.waitForLoadState();
    expect(tab.url()).toBe(new URL(target.url).href);
    expect(new URL(page.url()).pathname).toBe('/');
  });

  test('WhatsApp abre una conversación con el número configurado y un primer mensaje que dice de dónde llega', async ({ page, context }) => {
    if (!whatsapp) {
      // Apagado: sin WhatsApp configurado no hay icono que abra una conversación.
      await expect(page.getByTestId('desktop-icon-whatsapp')).toHaveCount(0);
      return;
    }
    const expected = new URL(whatsapp.url);
    const [tab] = await Promise.all([context.waitForEvent('page'), page.getByTestId('desktop-icon-whatsapp').dblclick()]);
    const url = new URL(tab.url());
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe(expected.pathname);
    expect(url.searchParams.get('text')).toBeTruthy();
    expect(url.searchParams.get('text')).toBe(expected.searchParams.get('text'));
  });

  test('el icono de WhatsApp es el de la app: casilla verde con el símbolo blanco', async ({ page }) => {
    if (!whatsapp) {
      await expect(page.getByTestId('desktop-icon-whatsapp')).toHaveCount(0);
      return;
    }
    const img = page.getByTestId('desktop-icon-whatsapp').locator('img');
    await expect(img).toHaveAttribute('src', '/links/whatsapp.png');
    const [r, g, b] = await img.evaluate(async (el) => {
      const image = el as HTMLImageElement;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 8;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(image, 0, 0, 8, 8);
      return [...ctx.getImageData(0, 0, 1, 1).data]; // la esquina: el verde de la casilla
    });
    expect(g).toBeGreaterThan(r + 60);
    expect(g).toBeGreaterThan(b + 60);
  });
});
