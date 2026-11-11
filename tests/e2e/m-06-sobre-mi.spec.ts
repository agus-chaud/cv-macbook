import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { animationsDone, enter } from './helpers';
import { PERSONA } from '../../src/content/persona';

const read = (file: string) => readFileSync(join(process.cwd(), 'src/content', file), 'utf8').replace(/\r\n/g, '\n');
const markdown = read('sobre-mi.md');
const english = read('sobre-mi.en.md');
const tagline = /^tagline: (.+)$/m.exec(markdown)![1];
const headings = [...markdown.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
const taglineEn = /^tagline: (.+)$/m.exec(english)![1];
const headingsEn = [...english.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
/** Los enlaces del CV a apps del escritorio (`[texto](#abrir-…)`), con el testid de la ventana que abren. */
const APP_TESTIDS: Record<string, string> = { 'abrir-proyectos': 'projects', 'abrir-correo': 'mail', 'abrir-stack': 'stack', 'abrir-visitas': 'guestbook' };
const appLinks = [...markdown.matchAll(/\[(?:\*\*)?([^\]*]+)(?:\*\*)?\]\(#(abrir-[a-z]+)\)/g)].map(([, text, key]) => ({ text, testid: APP_TESTIDS[key] }));
const linkedin = /\]\((https:\/\/www\.linkedin\.com\/[^)]+)\)/.exec(markdown)?.[1];
/** El único correo que el CV publica, a pedido de su dueño (la misma regla que `src/lib/cv.test.ts`). */
const CONTACT_EMAIL = 'aguschaud@gmail.com';

const isMobile = (name: string) => name.endsWith('movil');

async function openAbout(page: Page, projectName: string) {
  if (isMobile(projectName)) await page.getByTestId('mobile-icon-about').tap();
  else await page.getByTestId('desktop-icon-about').dblclick();
  await expect(page.getByTestId('about')).toBeVisible();
}

test.describe('M-06 Sobre mí como documento', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await enter(page);
  });

  test('abre el documento con la foto, el nombre, la línea de presentación y todas las secciones', async ({ page }, testInfo) => {
    await openAbout(page, testInfo.project.name);
    await expect(page.getByTestId('about-title')).toHaveText(`Hola, soy ${PERSONA.firstName}`);
    await expect(page.getByTestId('about-tagline')).toHaveText(tagline);
    const photo = page.getByTestId('about-photo');
    await expect.poll(() => photo.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByTestId('about-body').locator('h2')).toHaveText(headings);
  });

  test('el botón Descargar PDF apunta al PDF, y el PDF se sirve como PDF', async ({ page }, testInfo) => {
    await openAbout(page, testInfo.project.name);
    const button = page.getByTestId('about-download');
    await expect(button).toHaveAttribute('href', '/cv.pdf');
    await expect(button).toHaveAttribute('download', /\.pdf$/);
    const res = await page.request.get('/cv.pdf');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/pdf');
    expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-');
  });

  test('cada enlace del texto a una app del escritorio abre esa app', async ({ page }, testInfo) => {
    expect(appLinks.length).toBeGreaterThan(0);
    for (const [i, { text, testid }] of appLinks.entries()) {
      // En móvil la app abierta tapa la pantalla de inicio: hay que volver antes de reabrir Sobre mí.
      if (i > 0 && isMobile(testInfo.project.name)) await page.getByTestId('mobile-back').tap();
      await openAbout(page, testInfo.project.name);
      await page.getByTestId('about-body').getByRole('link', { name: text }).click();
      await expect(page.getByTestId(testid), text).toBeVisible();
    }
  });

  test('los enlaces externos se abren en una pestaña nueva y sin dar acceso al sitio', async ({ page }, testInfo) => {
    await openAbout(page, testInfo.project.name);
    const external = page.getByTestId('about-body').locator('a[href^="https://"]');
    expect(await external.count()).toBeGreaterThan(0);
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
    expect(linkedin, 'el CV enlaza a LinkedIn').toBeDefined();
    await expect(page.getByTestId('about-body').getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', linkedin!);
  });

  test.describe('casos negativos', () => {
    test('el documento no contiene más correo que el de contacto ni lo que se acordó no publicar', async ({ page }, testInfo) => {
      await openAbout(page, testInfo.project.name);
      const text = (await page.getByTestId('about').innerText()).replace(/\s+/g, ' ');
      const emails = [...text.matchAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g)].map((m) => m[0]);
      expect(new Set(emails)).toEqual(new Set([CONTACT_EMAIL]));
      for (const excluded of ['Lucía Ejemplo', 'Marcos Ejemplo']) {
        expect(text, excluded).not.toContain(excluded);
      }
      for (const href of await page.locator('a[href^="mailto:"]').evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
        expect(href).toBe(`mailto:${CONTACT_EMAIL}`);
      }
    });
  });

  test.describe('S-11 CV en inglés', () => {
    test('abre en español; EN pasa el documento a inglés y ES lo devuelve', async ({ page }, testInfo) => {
      await openAbout(page, testInfo.project.name);
      await expect(page.getByTestId('about-lang-es')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByTestId('about-sheet')).toHaveAttribute('lang', 'es');

      await page.getByTestId('about-lang-en').click();
      await expect(page.getByTestId('about-lang-en')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByTestId('about-sheet')).toHaveAttribute('lang', 'en');
      await expect(page.getByTestId('about-title')).toHaveText(`Hi, I'm ${PERSONA.firstName}`);
      await expect(page.getByTestId('about-tagline')).toHaveText(taglineEn);
      await expect(page.getByTestId('about-body').locator('h2')).toHaveText(headingsEn);

      await page.getByTestId('about-lang-es').click();
      await expect(page.getByTestId('about-title')).toHaveText(`Hola, soy ${PERSONA.firstName}`);
      await expect(page.getByTestId('about-body').locator('h2')).toHaveText(headings);
    });

    test('en inglés, Descargar PDF baja el PDF en inglés, que se sirve como PDF', async ({ page }, testInfo) => {
      await openAbout(page, testInfo.project.name);
      await page.getByTestId('about-lang-en').click();
      const button = page.getByTestId('about-download');
      await expect(button).toHaveAttribute('href', '/cv-en.pdf');
      await expect(button).toHaveAttribute('download', /-EN\.pdf$/);
      const res = await page.request.get('/cv-en.pdf');
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('application/pdf');
      expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-');

      await page.getByTestId('about-lang-es').click();
      await expect(button).toHaveAttribute('href', '/cv.pdf');
    });

    test('el documento en inglés no tiene errores de accesibilidad', async ({ page }, testInfo) => {
      await openAbout(page, testInfo.project.name);
      await page.getByTestId('about-lang-en').click();
      await animationsDone(page);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test('el documento no tiene errores de accesibilidad en claro ni en oscuro', async ({ page }, testInfo) => {
    await openAbout(page, testInfo.project.name);
    for (const theme of ['light', 'dark'] as const) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await animationsDone(page);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `tema ${theme}`).toEqual([]);
    }
  });
});
