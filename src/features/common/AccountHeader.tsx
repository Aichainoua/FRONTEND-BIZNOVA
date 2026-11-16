import { Alert } from 'react-native';
import { AppHeader } from '../../components/kit';
import { useAuthStore } from '../../stores/authStore';
import { initials } from '../../utils/format';

/** En-tête commun : logo + pastille d'initiales qui ouvre la déconnexion. */
export function AccountHeader() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const confirmSignOut = () =>
    Alert.alert('Se déconnecter ?', 'Vous retrouverez vos projets à votre prochaine connexion.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => void signOut() },
    ]);

  return <AppHeader initials={user ? initials(user.fullName) : undefined} onAvatarPress={confirmSignOut} />;
}
