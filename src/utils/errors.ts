import { isAxiosError } from 'axios';

export function getStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Une erreur est survenue. Réessayez dans un instant.',
): string {
  if (isAxiosError(error)) {
    if (!error.response) return 'Connexion impossible. Vérifiez votre réseau et réessayez.';
    const data = error.response.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.response.status >= 500) return 'Le serveur est momentanément indisponible. Réessayez plus tard.';
  }
  return fallback;
}
