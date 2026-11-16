import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { api } from '../api/client';
import { endpoints } from '../api/endpoints';
import { tokenStorage } from '../api/tokenStorage';
import { env } from '../config/env';

/**
 * Télécharge le PDF généré par le serveur (B1 / B2) puis ouvre la feuille de partage.
 * L'API d'expo-file-system change selon les SDK : si votre version diffère, seul ce fichier est à adapter.
 */
export async function downloadAndSharePdf(path: string, filename: string): Promise<void> {
  // Un appel authentifié léger : si le token a expiré, l'intercepteur le rafraîchit avant le téléchargement.
  await api.get(endpoints.auth.me);
  const token = await tokenStorage.getAccess();

  const file = await File.downloadFileAsync(`${env.apiUrl}${path}`, new File(Paths.cache, filename), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    idempotent: true,
  });

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('SHARING_UNAVAILABLE');
  }
  await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', dialogTitle: 'Partager le rapport', UTI: 'com.adobe.pdf' });
}
