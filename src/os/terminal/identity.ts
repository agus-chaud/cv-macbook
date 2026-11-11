/**
 * Quién «está» en la Terminal (S-04): usuario y sistema salen de la persona, así el prompt cambia solo al usar la plantilla.
 */
import { PERSONA } from '../../content/persona';

/** Un nombre como lo escribe una terminal: en minúsculas, sin tildes y con guiones en lugar de espacios. */
export const shellName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const SHELL_USER = shellName(PERSONA.firstName);
export const SHELL_HOST = `${SHELL_USER}@${shellName(PERSONA.osName)}`;
export const SHELL_PROMPT = `${SHELL_HOST} ~ %`;
