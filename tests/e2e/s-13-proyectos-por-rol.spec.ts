import { expect, test, type Page } from '@playwright/test';
import { enter, inFolder, loadProjects, openProjectDetail, stubExternalSites } from './helpers';

const folderProjects = inFolder(loadProjects());
const ofRole = (role: 'de' | 'ds') => folderProjects.filter((p) => p.roles.includes(role));
const withoutRole = folderProjects.find((p) => p.roles.length === 0);

const isMobile = (name: string) => name.endsWith('movil');
const click = (page: Page, testId: string, projectName: string) =>
  isMobile(projectName) ? page.getByTestId(testId).tap() : page.getByTestId(testId).click();

/** La vista general de Proyectos: en escritorio, su icono; en móvil, un detalle y el botón de volver. */
async function openOverview(page: Page, projectName: string) {
  if (isMobile(projectName)) {
    await openProjectDetail(page, projectName, folderProjects[0]);
    await page.getByTestId('projects-back').tap();
  } else {
    await page.getByTestId('desktop-icon-projects').dblclick();
  }
  await expect(page.getByTestId('projects')).toBeVisible();
}

/** Los ids de las tarjetas visibles, en el orden en que se ven. */
const cardIds = async (page: Page) =>
  (await page.locator('[data-testid^="projects-card-"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')))).map(
    (t) => t!.replace('projects-card-', ''),
  );

test.describe('S-13 Proyectos por rol', () => {
  test.beforeEach(async ({ page, context }) => {
    await stubExternalSites(context);
    await enter(page);
  });

  test('el selector empieza en «Todos» y enseña todos los proyectos de la carpeta', async ({ page }, testInfo) => {
    await openOverview(page, testInfo.project.name);
    const roles = page.getByRole('group', { name: 'Rol' });
    await expect(roles.getByRole('button')).toHaveText(['Todos', 'Data Engineering', 'Data Science']);
    await expect(page.getByTestId('projects-role-all')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('projects-role-de')).toHaveAttribute('aria-pressed', 'false');
    expect(await cardIds(page)).toEqual(folderProjects.map((p) => p.id));
  });

  for (const [role, label] of [
    ['de', 'Data Engineering'],
    ['ds', 'Data Science'],
  ] as const) {
    test(`«${label}» deja solo sus 3 o 4 proyectos, en su orden`, async ({ page }, testInfo) => {
      await openOverview(page, testInfo.project.name);
      await click(page, `projects-role-${role}`, testInfo.project.name);
      await expect(page.getByTestId(`projects-role-${role}`)).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByTestId('projects-role-all')).toHaveAttribute('aria-pressed', 'false');
      const expected = ofRole(role).map((p) => p.id);
      expect(expected.length).toBeGreaterThanOrEqual(3);
      expect(expected.length).toBeLessThanOrEqual(4);
      expect(await cardIds(page)).toEqual(expected);
    });
  }

  test('volver del detalle mantiene el rol elegido', async ({ page }, testInfo) => {
    await openOverview(page, testInfo.project.name);
    await click(page, 'projects-role-ds', testInfo.project.name);
    const p = ofRole('ds')[0];
    await click(page, `projects-card-${p.id}`, testInfo.project.name);
    await expect(page.getByTestId('project-name')).toHaveText(p.name);
    await click(page, 'projects-back', testInfo.project.name);
    await expect(page.getByTestId('projects-role-ds')).toHaveAttribute('aria-pressed', 'true');
    expect(await cardIds(page)).toEqual(ofRole('ds').map((x) => x.id));
  });

  test('«Todos» vuelve a enseñar la carpeta entera', async ({ page }, testInfo) => {
    await openOverview(page, testInfo.project.name);
    await click(page, 'projects-role-de', testInfo.project.name);
    await click(page, 'projects-role-all', testInfo.project.name);
    expect(await cardIds(page)).toEqual(folderProjects.map((p) => p.id));
  });

  test('el selector se maneja con teclado', async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo.project.name), 'En móvil no hay teclado físico');
    await openOverview(page, testInfo.project.name);
    await page.getByTestId('projects-role-all').focus();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('projects-role-de')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('projects-role-de')).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await expect(page.getByTestId('projects-role-ds')).toHaveAttribute('aria-pressed', 'true');
    expect(await cardIds(page)).toEqual(ofRole('ds').map((p) => p.id));
  });

  test('un proyecto sin rol no sale en ningún rol, pero sí en «Todos»', async ({ page }, testInfo) => {
    test.skip(!withoutRole, 'Todos los proyectos de la carpeta tienen rol');
    await openOverview(page, testInfo.project.name);
    await expect(page.getByTestId(`projects-card-${withoutRole!.id}`)).toBeVisible();
    for (const role of ['de', 'ds'] as const) {
      await click(page, `projects-role-${role}`, testInfo.project.name);
      await expect(page.getByTestId(`projects-card-${withoutRole!.id}`)).toHaveCount(0);
    }
  });
});
