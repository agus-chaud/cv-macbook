import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { CATEGORIES, TOOLS } from './stack-catalog';
import type { StackData } from './stack';
import { PERSONA } from '../content/persona';

// Guardas sobre el archivo que genera scripts/actualizar-stack.mjs: es lo que se publica en la web.
const raw = readFileSync(join(process.cwd(), 'src/content/stack.json'), 'utf8');
const data = JSON.parse(raw) as StackData;

describe('src/content/stack.json', () => {
  test('tiene la forma esperada y nada más', () => {
    expect(Object.keys(data).sort()).toEqual(['generatedAt', 'repos', 'tools']);
    expect(data.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Object.keys(data.repos).sort()).toEqual(['private', 'public', 'since', 'total']);
    expect(data.repos.since).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
    for (const t of data.tools) expect(Object.keys(t).sort(), t.id).toEqual(['category', 'id', 'name', 'projects', 'repos', 'since']);
  });

  test('los recuentos de repositorios cuadran', () => {
    expect(data.repos.public + data.repos.private).toBe(data.repos.total);
    expect(data.repos.total).toBeGreaterThan(0);
  });

  test('todas las herramientas están en el catálogo, con su nombre y categoría', () => {
    for (const t of data.tools) {
      const def = TOOLS.find((d) => d.id === t.id);
      expect(def, `${t.id} no está en el catálogo`).toBeDefined();
      expect(t.name).toBe(def!.name);
      expect(t.category).toBe(def!.category);
      expect(CATEGORIES.some((c) => c.id === t.category)).toBe(true);
    }
    const ids = data.tools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('ninguna herramienta aparece en más repositorios de los que hay, y su año es posible', () => {
    const thisYear = new Date().getFullYear();
    for (const t of data.tools) {
      expect(t.repos, t.id).toBeGreaterThan(0);
      expect(t.repos, t.id).toBeLessThanOrEqual(data.repos.total);
      expect(t.since, t.id).toBeGreaterThanOrEqual(TOOLS.find((d) => d.id === t.id)!.introduced ?? 2022);
      expect(t.since, t.id).toBeLessThanOrEqual(thisYear);
    }
  });

  test('S-12: cada proyecto de una herramienta existe en la app Proyectos, y no hay más proyectos que repositorios', () => {
    const ids = new Set(readdirSync(join(process.cwd(), 'src/content/projects')).map((f) => f.replace(/\.json$/, '')));
    for (const t of data.tools) {
      for (const p of t.projects) expect(ids.has(p), `${t.id} → ${p}`).toBe(true);
      expect(t.projects.length, t.id).toBeLessThanOrEqual(t.repos);
    }
    // Al menos una herramienta tiene proyectos: si no, el script dejó de asociarlos.
    expect(data.tools.some((t) => t.projects.length > 0)).toBe(true);
  });

  test('no revela el nombre de ningún repositorio, público ni privado', () => {
    // Los nombres concretos no se pueden listar aquí (este archivo se publica): el script ya se niega a escribir si se cuela uno.
    expect(raw.toLowerCase()).not.toContain(PERSONA.github.toLowerCase());
    expect(raw).not.toMatch(/github\.com|\/[\w.-]+\/[\w.-]+/i);
  });
});
