const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (value: string): boolean => EMAIL_RE.test(value.trim());

/** Au moins 8 caractères, une lettre et un chiffre. */
export const isPasswordValid = (value: string): boolean =>
  value.length >= 8 && /[A-Za-zÀ-ÿ]/.test(value) && /\d/.test(value);
