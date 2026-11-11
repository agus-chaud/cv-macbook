import { describe, expect, test } from 'vitest';
import { LINKS } from '../content/links';
import { desktopItems, mobileItems } from './items';

const project = { id: 'p1', name: 'P1', placement: 'folder', colors: { from: '#000', to: '#fff' } } as Parameters<typeof desktopItems>[0][number];
const ids = (items: { id: string }[]) => items.map((i) => i.id);

describe('iconos del escritorio', () => {
  test('el Libro de visitas no tiene icono, y LinkedIn ocupa su sitio, después de Favoritos', () => {
    const order = ids(desktopItems([project]));
    expect(order).not.toContain('guestbook');
    expect(order.slice(0, 5)).toEqual(['projects', 'about', 'notes', 'favorites', 'linkedin']);
    expect(order.slice(5, 7)).toEqual(['stack', 'howto']);
  });

  test('los demás accesos externos siguen al final, y LinkedIn no se repite', () => {
    const order = ids(desktopItems([project]));
    const others = LINKS.filter((l) => l.id !== 'linkedin').map((l) => l.id);
    expect(order.slice(7)).toEqual(others);
    expect(order.filter((id) => id === 'linkedin')).toHaveLength(1);
  });

  test('con el contenido actual quedan 8 iconos: dos columnas de cuatro', () => {
    expect(desktopItems([project])).toHaveLength(8);
  });

  test('en móvil el Libro de visitas sigue en la pantalla de inicio', () => {
    expect(ids(mobileItems([project], []))).toContain('guestbook');
  });
});
