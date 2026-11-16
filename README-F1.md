# BizNova — code F1 (inscription, connexion, accueil, workflow A)

Code généré à partir des 13 maquettes + de l'écran d'inscription, pour le template
React Native + Expo (TypeScript, React Navigation v7, Zustand, Axios + TanStack Query, lucide-react-native).

## 1. Intégration dans le template

Copiez le contenu de ce dossier à la racine du template :

| Fichier | Action |
|---|---|
| `App.tsx` | **remplace** celui du template |
| `src/api/client.ts`, `src/api/endpoints.ts` | **remplacent** ceux du template |
| `src/theme/tokens.ts` | **nouveau** (palette des maquettes, valeurs à confirmer avec le designer) |
| `src/components/kit/` | **nouveau** : composants provisoires de F1 (voir §5) |
| `src/features/`, `src/navigation/`, `src/stores/authStore.ts`, `src/utils/`, `src/config/`, `src/api/mocks/` | **nouveaux** |
| `.env.example` | à copier en `.env` |

Supprimez des écrans d'exemple du template (`HomeScreen`, `DetailsScreen`, `src/navigation/AppNavigator.tsx`) et n'installez pas Socket.IO : il n'est pas utilisé.

### Dépendances à ajouter

```bash
# Modules natifs : toujours avec expo install (versions compatibles avec votre SDK)
npx expo install expo-secure-store expo-file-system expo-sharing expo-status-bar react-native-svg react-native-safe-area-context react-native-screens

pnpm add @react-navigation/bottom-tabs react-hook-form zod @hookform/resolvers axios-mock-adapter
pnpm add -D jest-expo @testing-library/react-native
```

`react-hook-form` + `zod` : validation des formulaires. `axios-mock-adapter` : API de démonstration.
Aucune bibliothèque de graphiques : la courbe est dessinée en SVG (`CashLineChart`).

### Lancer

```bash
cp .env.example .env     # EXPO_PUBLIC_USE_MOCKS=true = l'app tourne sans back
pnpm start
```

Compte de démonstration : **amina.diop@email.com / Biznova2026** (ou créez un compte).
Mode démo = données en mémoire : tout est remis à zéro au rechargement de l'app.
Passez `EXPO_PUBLIC_USE_MOCKS=false` et `EXPO_PUBLIC_API_URL=...` pour brancher le vrai back.

### Tests

```bash
pnpm exec jest        # preset jest-expo ; tests dans src/**/*.test.ts
```

33 tests : formatage FCFA, validation des formulaires, moteur de démonstration (valeurs exactes de la maquette),
parcours complet contre l'API de démo. Ils ont été exécutés avec Vitest en mode `globals` ; la syntaxe `describe/it/expect` est identique en Jest.

## 2. Ce qui est couvert

| Story | Écran / fichier |
|---|---|
| US-01 Connexion | `features/auth/screens/LoginScreen.tsx` (maquette 1) |
| US-01b Inscription, mot de passe oublié, déconnexion | `RegisterScreen.tsx` (maquette fournie), `ForgotPasswordScreen.tsx` (**provisoire**), pastille d'initiales → déconnexion |
| US-02 Accueil | `features/home/HomeScreen.tsx` (maquette 2) |
| US-A1 Projet, étape 1 | `ProjectStep1Screen.tsx` (maquette 3) |
| US-A1b Liste des projets | `ProjectListScreen.tsx` (**provisoire**) |
| US-A0 Brouillon | « Enregistrer et quitter / reprendre plus tard » (étapes 1 et 2) |
| US-A2, A2c Hypothèses + erreurs | `AssumptionsScreen.tsx` (maquette 4), `schemas.ts` |
| US-A3, A4, A5, A9 Résultats | `ResultsScreen.tsx` (maquette 5), `CashLineChart.tsx` |
| US-A6, A6b Rapport + export PDF | `ReportScreen.tsx` (maquette 6), `utils/pdf.ts` |
| US-T1 FCFA | `utils/format.ts` |
| US-T2 Secteurs | `features/forecast/sectors.ts` : textes d'aide par secteur, lus via `GET /config/sectors` |
| Navigation (socle) | `navigation/` : Auth / 4 onglets / pile Projets |

Les onglets **Entreprise** et **Rapports** sont des écrans « Bientôt disponible » : F2 les remplace dans `navigation/AppTabs.tsx`.

## 3. Contrat d'API supposé (à confronter à l'OpenAPI de B1 / B2)

| Méthode + route | Rôle |
|---|---|
| `POST /auth/login`, `/auth/register` | → `{ user, accessToken, refreshToken }` ; 401 identifiants / 409 email déjà pris |
| `POST /auth/refresh`, `/auth/logout`, `/auth/forgot-password` ; `GET /auth/me` | session |
| `GET /config/sectors` | `SectorConfig[]` (libellés + textes d'aide) |
| `GET /me/recent-work` | projets récents + suivi réel (accueil) |
| `GET/POST /projects`, `GET/PATCH /projects/:id` | projet ; `resumeStep` (1, 2 ou 3) indique l'étape à rouvrir |
| `PUT /projects/:id/assumptions` | `{ assumptions, draft }` ; `draft: true` = champs partiels acceptés ; 422 si incomplet et `draft: false` |
| `GET /projects/:id/results` | 409 si hypothèses incomplètes |
| `GET /projects/:id/report`, `/report/pdf` | rapport JSON ; PDF binaire |

Types exacts : `src/features/forecast/types.ts`. Montants en **entiers FCFA**, pourcentages en nombres (20 = 20 %), dates `YYYY-MM-DD`.

Règles retenues dans le moteur de démo (à valider avec B1) : récupération de l'apport = premier mois où les flux cumulés,
investissement inclus, sont **≥ 0** ; trésorerie de départ = apport + emprunt − investissement ; aucun intérêt d'emprunt ;
VAN calculée sur des flux mensuels avec un taux mensuel équivalent.

## 4. Maquettes manquantes (écrans provisoires ou absents)

Mot de passe oublié · liste des projets · états d'erreur de l'écran « hypothèses » (la validation existe, le rendu est à confirmer) ·
variantes des écrans 3 et 4 pour commerce et services (les textes d'aide changent déjà ; les champs spécifiques par secteur ne sont pas implémentés) ·
modèle du PDF (généré côté serveur) · pages « conditions d'utilisation » et « politique de confidentialité ».

## 5. Coordination avec F2

`src/components/kit/` contient les composants dont F1 a besoin. Tous les écrans les importent via `components/kit/index.ts` :
quand F2 livre son design system, remplacez les exports un par un (mêmes noms, mêmes props) sans toucher aux écrans.
`src/theme/tokens.ts` est à fusionner avec `theme/` de F2.

## 6. Limites connues

- Le code a été vérifié par `tsc --strict` et par des tests unitaires ; **il n'a pas été exécuté sur un émulateur ni un téléphone** : le rendu visuel est à valider sur appareil.
- `utils/pdf.ts` utilise l'API `File.downloadFileAsync` d'`expo-file-system` (vérifiée sur la version 58 des modules). Si votre SDK en expose une autre, seul ce fichier change.
- Export PDF désactivé en mode démo (le PDF est généré par le serveur).
