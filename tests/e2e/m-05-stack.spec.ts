import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PERSONA } from '../../src/content/persona';
import { animationsDone, enter, loadProjects } from './helpers';

interface Data {
  generatedAt: string;
  repos: { total: number; public: number; private: number; since?: string };
  tools: { id: string; name: string; category: string; repos: number; since: number; projects: string[] }[];
}
const data = JSON.parse(readFileSync(join(process.cwd(), 'src/content/stack.json'), 'utf8')) as Data;

const isMobile = (name: string) => name.endsWith('movil');

async function openStack(page: Page, projectName: string) {
  if (isMobile(projectName)) await page.getByTestId('mobile-icon-stack').tap();
  else await page.getByTestId('desktop-icon-stack').dblclick();
  await expect(page.getByTestId('stack')).toBeVisible();
}

test.describe('M-05 Stack', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await enter(page);
  });

  test('el icono se llama Stack y ya no existe "Herramientas"', async ({ page }, testInfo) => {
    const icon = page.getByTestId(isMobile(testInfo.project.name) ? 'mobile-icon-stack' : 'desktop-icon-stack');
    await expect(icon).toContainText('Stack');
    await expect(page.getByTestId(isMobile(testInfo.project.name) ? 'mobile-home' : 'desktop')).not.toContainText('Herramientas');
  });

  const categories = [...new Set(data.tools.map((t) => t.category))];
  const years = [...new Set(data.tools.map((t) => t.since))].sort();
  // El mes del repositorio más antiguo (aunque no tenga herramientas), o el primer año con herramientas en datos antiguos.
  const since = data.repos.since ?? String(Math.min(...data.tools.map((t) => t.since)));

  test('arriba, tres cifras: herramientas, repositorios y desde cuándo construye', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    await expect(page.getByTestId('stack-stat-tools')).toHaveText(`${data.tools.length}herramientas`);
    await expect(page.getByTestId('stack-stat-repos')).toHaveText(`${data.repos.total}repositorios`);
    await expect(page.getByTestId('stack-stat-since')).toHaveText(`${since}construyendo desde`);
  });

  test('las secciones van en este orden: cifras, año a año, por categoría y detalle por herramienta', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    const order = await page
      .getByTestId('stack')
      .locator('[data-testid="stack-stats"], [data-testid="stack-years"], [data-testid="stack-donut"], [data-testid="stack-detail"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-testid')));
    expect(order).toEqual(['stack-stats', 'stack-years', 'stack-donut', 'stack-detail']);
  });

  test('no hay mapa de burbujas ni de recuadros: el detalle ya enseña cada herramienta', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    await expect(page.getByTestId('stack-map')).toHaveCount(0);
    await expect(page.locator('[data-testid^="stack-tile-"], [data-testid^="stack-bubble-"]')).toHaveCount(0);
  });

  test('explica cómo se obtienen los datos', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    await expect(page.getByTestId('stack-how')).toContainText('GitHub Actions');
    await expect(page.getByTestId('stack-how')).toContainText('solo lectura');
  });

  test('el título de cada categoría del detalle va en mayúsculas y con el color de su categoría', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    for (const category of categories) {
      const title = page.getByTestId(`stack-group-${category}`).locator('h4');
      const legendDot = page.getByTestId(`stack-legend-${category}`).locator('.dot');
      const [titleBg, dotBg, transform] = await Promise.all([
        title.evaluate((el) => getComputedStyle(el).backgroundColor),
        legendDot.evaluate((el) => getComputedStyle(el).backgroundColor),
        title.evaluate((el) => getComputedStyle(el).textTransform),
      ]);
      expect(transform, category).toBe('uppercase');
      expect(titleBg, category).toBe(dotBg);
      expect(titleBg, category).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('el rosco tiene una porción y una entrada de leyenda por categoría, con su número de herramientas', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    await expect(page.getByTestId('stack-donut').locator('svg path')).toHaveCount(categories.length);
    await expect(page.getByTestId('stack-donut').locator('svg')).toHaveAttribute('aria-label', /herramientas por categoría/);
    for (const category of categories) {
      const entry = page.getByTestId(`stack-legend-${category}`);
      await expect(entry.getByTestId('stack-legend-count')).toHaveText(String(data.tools.filter((t) => t.category === category).length));
    }
    await expect(page.getByTestId('stack-donut').locator('.donut-center')).toContainText(String(data.tools.length));
  });

  test('año a año: una columna por año, con el total acumulado y las herramientas que entraron', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    const first = years[0];
    const last = years.at(-1)!;
    const all = Array.from({ length: last - first + 1 }, (_, i) => first + i);
    await expect(page.getByTestId('stack-year')).toHaveText(all.map(String));
    let running = 0;
    for (const year of all) {
      const added = data.tools.filter((t) => t.since === year);
      running += added.length;
      const column = page.getByTestId(`stack-year-${year}`);
      await expect(column.getByTestId('stack-year-total')).toHaveText(String(running));
      if (added.length > 0) {
        for (const t of added) await expect(column).toContainText(t.name);
      } else await expect(column).toContainText('Sin altas');
    }
    expect(running).toBe(data.tools.length);
  });

  test('el detalle por herramienta está siempre a la vista, con cada categoría y cada herramienta', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    await expect(page.getByTestId('stack-detail').getByRole('heading', { name: 'Detalle por herramienta' })).toBeVisible();
    for (const category of categories) await expect(page.getByTestId(`stack-group-${category}`)).toBeVisible();
    await expect(page.locator('[data-testid^="stack-tool-"]')).toHaveCount(data.tools.length);
  });

  test('cada herramienta enseña en cuántos repositorios aparece y desde qué año', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    for (const t of data.tools) {
      const row = page.getByTestId(`stack-tool-${t.id}`);
      await expect(row).toContainText(t.name);
      await expect(row.getByTestId('stack-count')).toHaveText(String(t.repos));
      await expect(row.getByTestId('stack-since')).toHaveText(String(t.since));
    }
  });

  test.describe('S-12 proyectos por herramienta', () => {
    const tool = data.tools.find((t) => t.projects.length > 1)!;
    const names = new Map(loadProjects().map((p) => [p.id, p.name]));

    test('pulsar una herramienta despliega sus proyectos, y su enlace abre ese proyecto en Proyectos', async ({ page }, testInfo) => {
      await openStack(page, testInfo.project.name);
      await expect(page.getByTestId('stack-detail-hint')).toBeVisible();
      const toggle = page.getByTestId(`stack-toggle-${tool.id}`);
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      const uses = page.getByTestId(`stack-uses-${tool.id}`);
      await expect(uses.locator('button')).toHaveCount(tool.projects.length);
      for (const id of tool.projects) await expect(uses.getByTestId(`stack-project-${tool.id}-${id}`)).toHaveText(names.get(id)!);

      const first = tool.projects[0];
      await uses.getByTestId(`stack-project-${tool.id}-${first}`).click();
      await expect(page.getByTestId('project-name')).toHaveText(names.get(first)!);
    });

    test('con el teclado: Enter y Espacio despliegan y repliegan, y abrir otra herramienta cierra la anterior', async ({ page }, testInfo) => {
      await openStack(page, testInfo.project.name);
      const toggle = page.getByTestId(`stack-toggle-${tool.id}`);
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Space');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');

      const other = data.tools.find((t) => t.id !== tool.id)!;
      await toggle.click();
      await page.getByTestId(`stack-toggle-${other.id}`).click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByTestId(`stack-uses-${tool.id}`)).toHaveCount(0);
      await expect(page.getByTestId(`stack-uses-${other.id}`)).toBeVisible();
    });

    test('con una herramienta desplegada no hay errores de accesibilidad', async ({ page }, testInfo) => {
      await openStack(page, testInfo.project.name);
      await page.getByTestId(`stack-toggle-${tool.id}`).click();
      for (const theme of ['light', 'dark'] as const) {
        await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
        await animationsDone(page);
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations, `tema ${theme}`).toEqual([]);
      }
    });
  });

  test('no hay cambio de vista: todo está en una sola columna y no se desborda a los lados, ni con el texto más grande', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    const overflow = () => page.getByTestId('stack').evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(await overflow()).toBeLessThanOrEqual(1);
    await page.evaluate(() => document.documentElement.setAttribute('data-text', 'muy-grande'));
    await animationsDone(page);
    expect(await overflow()).toBeLessThanOrEqual(1);
  });

  test('la Terminal abre el Stack con `open stack`', async ({ page }, testInfo) => {
    if (isMobile(testInfo.project.name)) await page.getByTestId('mobile-dock-terminal').tap();
    else await page.getByTestId('dock-item-terminal').click();
    const input = page.getByTestId('terminal-input');
    await input.fill('open stack');
    await input.press('Enter');
    await expect(page.getByTestId('stack')).toBeVisible();
  });

  test.describe('casos negativos', () => {
    test('las cifras, el año a año y el reparto no tienen nada clicable; en el detalle, solo las herramientas', async ({ page }, testInfo) => {
      await openStack(page, testInfo.project.name);
      const interactive = 'a, button, input, select, textarea, summary, details, [tabindex], [role="button"], [role="link"], [role="tab"], [role="tablist"]';
      for (const id of ['stack-stats', 'stack-years', 'stack-donut']) await expect(page.getByTestId(id).locator(interactive), id).toHaveCount(0);
      // S-12: con todo cerrado, los únicos elementos que se pulsan son los botones de las herramientas.
      await expect(page.getByTestId('stack').locator(interactive)).toHaveCount(data.tools.length);
      await expect(page.locator('[data-testid^="stack-toggle-"]')).toHaveCount(data.tools.length);
    });

    test('S-12: una herramienta que ningún proyecto de Proyectos usa dice en cuántos repositorios se usa y no enlaza a nada', async ({ page }, testInfo) => {
      const lonely = data.tools.find((t) => t.projects.length === 0)!;
      await openStack(page, testInfo.project.name);
      await page.getByTestId(`stack-toggle-${lonely.id}`).click();
      const uses = page.getByTestId(`stack-uses-${lonely.id}`);
      await expect(uses).toContainText(`Se usa en ${lonely.repos} ${lonely.repos === 1 ? 'repositorio' : 'repositorios'} que no están en Proyectos`);
      await expect(uses.locator('button, a')).toHaveCount(0);
    });

    test('avisa de que los recuentos incluyen proyectos que nacieron de un generador', async ({ page }, testInfo) => {
      await openStack(page, testInfo.project.name);
      await expect(page.getByTestId('stack-note')).toContainText('generador');
    });

    test('no se ve el nombre de ningún repositorio', async ({ page }, testInfo) => {
      await openStack(page, testInfo.project.name);
      const text = await page.getByTestId('stack').innerText();
      // Ni la dirección de GitHub ni el usuario: el Stack solo cuenta herramientas.
      expect(text).not.toMatch(/github\.com/i);
      expect(text.toLowerCase()).not.toContain(PERSONA.github.toLowerCase());
    });
  });

  test('la ficha no tiene errores de accesibilidad en claro ni en oscuro', async ({ page }, testInfo) => {
    await openStack(page, testInfo.project.name);
    for (const theme of ['light', 'dark'] as const) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await animationsDone(page);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `tema ${theme}`).toEqual([]);
    }
  });
});
