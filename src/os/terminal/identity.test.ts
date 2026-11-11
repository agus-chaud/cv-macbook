import { describe, expect, test } from 'vitest';
import { PERSONA } from '../../content/persona';
import { SHELL_HOST, SHELL_PROMPT, SHELL_USER, shellName } from './identity';

describe('identidad de la Terminal', () => {
  test('el usuario y el sistema salen de la persona, en minúsculas y sin espacios ni tildes', () => {
    expect(shellName('Agus')).toBe('agus');
    expect(shellName('Agus OS')).toBe('agus-os');
    expect(shellName('Álex Ejemplo OS')).toBe('alex-ejemplo-os');
    expect(SHELL_USER).toBe(shellName(PERSONA.firstName));
    expect(SHELL_HOST).toBe(`${SHELL_USER}@${shellName(PERSONA.osName)}`);
  });

  test('el prompt es usuario@sistema ~ %', () => {
    expect(SHELL_PROMPT).toBe(`${SHELL_HOST} ~ %`);
  });
});
