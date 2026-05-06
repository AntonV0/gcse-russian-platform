const CYRILLIC_PATTERN = /[\u0400-\u04ff]/;

export function isCyrillicText(value: string) {
  return CYRILLIC_PATTERN.test(value);
}

export function getTextLanguage(value: string) {
  return isCyrillicText(value) ? "ru" : undefined;
}
