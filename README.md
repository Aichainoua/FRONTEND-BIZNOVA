# React Native Expo Starter Template (Production-Ready)

Template de démarrage moderne, robuste et modulaire pour applications mobiles **React Native + Expo**, préconfiguré avec **TypeScript**, **React Navigation**, gestion des thèmes **Clair / Sombre**, icônes vectorielles **Lucide** (zéro emoji), store global **Zustand**, et configuration prête pour la génération d'**APKs de développement et de production (compatibilité Android 7.0+ / API 24)**.

---

## 1. Stack Technique

* **Framework** : React Native (0.86+) + Expo (SDK 57+)
* **Langage** : TypeScript 6.x (Typage strict)
* **Navigation** : React Navigation v7 (`@react-navigation/native-stack`)
* **State Management** : Zustand v5 (Persistant & ultra-léger)
* **Design & Thème** : Mode Clair par défaut + Switch Sombre + Palette dynamique
* **Iconographie** : `lucide-react-native` (100% vectoriel, aucune utilisation d'emojis)
* **Requêtes API** : Axios + TanStack React Query v5
* **Temps Réel** : Socket.IO Client
* **Builds Android** : Support des builds locaux Gradle et cloud EAS Build

---

## 2. Structure du Projet

```
react-native-expo-template/
├── App.tsx                      # Point d'entrée principal avec providers
├── app.json                     # Configuration Expo (Nom, Bundle ID, Package Name, Splash)
├── eas.json                     # Profils de build APK / AAB (Development, Preview, Production)
├── package.json                 # Dépendances et scripts de build
├── tsconfig.json                # Configuration TypeScript
├── assets/                      # Icônes adaptatives, splash screen et favicons
└── src/
    ├── api/                     # Client HTTP Axios et constantes d'endpoints
    │   ├── client.ts
    │   └── endpoints.ts
    ├── components/              # Composants UI réutilisables
    │   ├── common/              # ThemeToggle, Header, StatusBadge
    │   └── ui/                  # Button, Input, Card, Badge
    ├── navigation/              # Navigateurs Stack et définition des routes
    │   ├── AppNavigator.tsx
    │   └── routes.ts
    ├── screens/                 # Écrans de l'application
    │   ├── HomeScreen.tsx
    │   └── DetailsScreen.tsx
    ├── services/                # Services transverses (Socket.IO, notifications, GPS)
    ├── stores/                  # Stores Zustand (themeStore, authStore)
    │   └── themeStore.ts
    ├── theme/                   # Palette de couleurs, espacements et typographie
    │   ├── colors.ts
    │   └── spacing.ts
    ├── types/                   # Interfaces et types TypeScript
    └── utils/                   # Fonctions utilitaires et formateurs
```

---

## 3. Démarrage Rapide

### Prérequis
* Node.js $\ge 18$
* `pnpm` (ou `npm` / `yarn`)
* JDK 17 ou 21
* Android Studio & Android SDK (pour les tests et builds locaux)

### Installation et lancement

```bash
# 1. Cloner ou dupliquer ce dépôt
git clone <URL_DU_REPO> mon-nouveau-projet
cd mon-nouveau-projet

# 2. Installer les dépendances
pnpm install

# 3. Lancer le serveur de développement Metro
pnpm start
```

### Raccourcis dans le terminal Metro :
* Appuyez sur `a` pour lancer sur émulateur ou appareil physique **Android**.
* Appuyez sur `i` pour lancer sur simulateur **iOS**.
* Appuyez sur `w` pour tester sur navigateur **Web**.

---

## 4. Comment Adapter ce Template pour une Nouvelle Application

Pour créer une nouvelle application à partir de ce template, effectuez ces 4 étapes simples :

### 1. Modifier le `package.json`
Mettez à jour le champ `"name"` et `"description"` :
```json
{
  "name": "mon-app-client",
  "version": "1.0.0"
}
```

### 2. Configurer `app.json`
Personnalisez les identifiants uniques de votre application :
```json
{
  "expo": {
    "name": "Mon Application",
    "slug": "mon-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.monentreprise.monapp"
    },
    "android": {
      "package": "com.monentreprise.monapp",
      "versionCode": 1
    }
  }
}
```

### 3. Remplacer les Assets Graphiques
Dans le dossier `assets/` :
* `icon.png` (1024x1024 px) : Icône de l'application
* `splash-icon.png` (200x200 px) : Icône de l'écran de chargement
* `android-icon-foreground.png` & `android-icon-background.png` : Icône adaptative Android

### 4. Personnaliser la Charte Graphique
Dans `src/theme/colors.ts`, modifiez simplement les couleurs principales (`primary`, `accent`, etc.).

---

## 5. Guide Complet de Build des APKs (Android)

Ce template supporte à la fois les **builds locaux sur votre machine (sans dépendre du cloud)** et les **builds automatisés via Expo EAS Build**.

---

### Option A : Génération Locale d'APK (Recommandée & Rapide)

Cette méthode génère directement les fichiers natifs Android et compile l'APK sur votre machine Linux / macOS / Windows.

#### 1. Générer le dossier natif `android/`
```bash
npx expo prebuild --clean
```

#### 2. Générer l'APK de Développement / Debug
```bash
cd android
./gradlew assembleDebug
```
* **Emplacement du fichier généré** :  
  `android/app/build/outputs/apk/debug/app-debug.apk`

#### 3. Générer l'APK Autonome de Production / Release
```bash
cd android
./gradlew assembleRelease
```
* **Emplacement du fichier généré** :  
  `android/app/build/outputs/apk/release/app-release.apk`

---

### Option B : Génération d'APK via EAS Build (Cloud Expo)

Si vous préférez générer vos APKs sur les serveurs sécurisés d'Expo sans configurer Android Studio localement :

#### 1. Installer et configurer EAS CLI
```bash
npm install -g eas-cli
eas login
eas build:configure
```

#### 2. Générer un APK de Test Interne (Preview)
```bash
eas build -p android --profile preview
```
*Génère un lien de téléchargement direct de l'APK installable sur n'importe quel smartphone Android.*

#### 3. Générer l'APK de Production
```bash
eas build -p android --profile production
```

---

## 6. Garantie de Compatibilité Android 7.0+ (API Level 24)

Ce template est spécialement calibré pour éviter les erreurs classiques de build Gradle sur les versions d'Android 7+ :

1. **`minSdkVersion 24`** : Prise en charge de 99.5% des appareils Android en circulation.
2. **MultiDex Activé** : Empêche l'erreur de dépassement de la table des 64K méthodes lors de la compilation de release.
3. **Hermes JS Engine** : Démarrage instantané et empreinte mémoire réduite de 50%.
4. **Zéro Conflit ProGuard / R8** : Conservation des interfaces réseau et des modules natifs lors de l'optimisation de release.

---

## 7. Commandes Disponibles

| Commande | Action |
| :--- | :--- |
| `pnpm start` | Démarre le serveur de développement Metro |
| `pnpm android` | Ouvre l'application sur émulateur/appareil Android |
| `pnpm ios` | Ouvre l'application sur simulateur iOS |
| `pnpm web` | Démarre la version web locale |
| `pnpm prebuild` | Génère les répertoires natifs `/android` et `/ios` |
| `pnpm type-check` | Vérifie la conformité des types TypeScript |
| `pnpm build:android:local:debug` | Compile l'APK local de debug |
| `pnpm build:android:local:release` | Compile l'APK local de release (production) |

---

## 8. Licence

Ce template est sous licence libre **MIT**. Vous pouvez l'utiliser, le modifier et le distribuer librement pour tous vos projets commerciaux et personnels.
