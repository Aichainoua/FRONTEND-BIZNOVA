import { Alert, Linking } from 'react-native';
import { env } from '../config/env';

export function openLegal(kind: 'terms' | 'privacy'): void {
  const url = kind === 'terms' ? env.termsUrl : env.privacyUrl;
  if (!url) {
    Alert.alert('Document bientôt disponible', 'Ce document sera publié avant le lancement de BizNova.');
    return;
  }
  void Linking.openURL(url);
}
