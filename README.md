# Biznova — application mobile (frontend)

Application mobile d'analyse financière prévisionnelle et de gestion budgétaire pour les porteurs de projets et les petites entreprises (FCFA par défaut). Ce dépôt contient le frontend **React Native + Expo** ; il suit le cahier des charges *Smart Realization* et la maquette Figma « Biznova ».

## État d'avancement

| Périmètre | État |
| :--- | :--- |
| Design system (tokens, composants, mise en page, barre d'onglets) | Fait |
| Connexion et espace de travail (maquettes 01, 02) | Fait — authentification simulée |
| **Workflow B** : configuration, tableau de bord, opérations et étiquettes, ajout, budget (y compris dépassement), rapport mensuel (maquettes 07 à 13) | Fait — données locales, export PDF |
| Workflow A : analyse prévisionnelle (maquettes 03 à 06) | À faire — l'onglet « Projets » est un écran d'attente |
| API, authentification réelle, persistance (critère R9) | À brancher — voir « Ce qui reste à brancher » |

## Stack

* **Framework** : React Native 0.86 + Expo SDK 57, TypeScript strict
* **Navigation** : React Navigation 7 (pile racine, onglets, pile « Entreprise »)
* **État** : Zustand 5 · **Icônes** : lucide-react-native · **Police** : Inter (`@expo-google-fonts/inter`)
* **Export PDF** : `expo-print` + `expo-sharing`
* **Prévu pour la suite** : Axios + TanStack Query (API), Socket.IO (déjà installés, pas encore utilisés)

## Démarrage

```bash
pnpm install
cp .env.example .env     # puis ajuster si besoin
pnpm start               # a = Android, i = iOS, w = web
pnpm type-check          # à lancer avant chaque demande de fusion
```

`EXPO_PUBLIC_SEED_DATA` (voir `.env.example`) :

* `true` : charge l'entreprise de démonstration « Nova Studio » (septembre et octobre 2026). Ses chiffres reproduisent exactement la maquette.
* `false` ou absente : l'application démarre sans donnée et l'onglet « Entreprise » affiche l'écran de configuration (comportement réel).

Après modification du `.env`, relancer Metro avec `pnpm start --clear`.

## Architecture

```
src/
├── domain/        Règles métier pures (aucune dépendance à React) : types, dates, calculs
│                  budget / trésorerie / flux, catégories par secteur, validation
├── mocks/         Jeu de données de démonstration (à supprimer quand l'API sera branchée)
├── stores/        Zustand : businessStore (entreprise, opérations, période), sessionStore, themeStore
├── hooks/         useBusiness / usePeriodData : données dérivées de la période sélectionnée
├── services/      reportPdf : génération et partage du rapport mensuel
├── navigation/    AppNavigator (racine) → MainTabs (onglets) → BusinessNavigator (pile Entreprise)
├── screens/       auth · home · projects · business · reports
├── components/
│   ├── ui/        Briques du design system (Text, Button, Card, Badge, HeroCard, ProgressBar…)
│   ├── forms/     Champs (Field, AmountInput, DateField, SelectField, TagInput)
│   ├── finance/   Composants métier (PeriodSelector, OperationRow, FlowBarChart)
│   └── layout/    Screen, AppHeader, PageIntro, TabBar
├── theme/         Couleurs, espacements, typographie (source unique des valeurs visuelles)
└── utils/         Formatage FCFA et dates en français, identité de l'utilisateur
```

Principes :

* **Calculs hors de l'interface.** Tout calcul financier vit dans `src/domain/finance.ts` (fonctions pures). Les écrans n'additionnent rien eux-mêmes ; ils lisent `usePeriodData()`.
* **Une seule source pour l'apparence.** Couleurs, espacements et textes passent par `src/theme` et par le composant `Text`. Pas de valeur de couleur ni de police écrite en dur dans un écran.
* **Routes typées.** Les noms de routes sont dans `navigation/routes.ts` et les paramètres dans `navigation/types.ts`.
* **Montants** : toujours via `utils/format.ts` (espace insécable, vrai signe moins, FCFA). `Intl` n'est volontairement pas utilisé (support variable sur Android 7+).

## Navigation

```
Racine
├── Connexion                       (session fermée)
└── Onglets                         (session ouverte)
    ├── Accueil        Espace de travail
    ├── Projets        Écran d'attente (workflow A)
    ├── Entreprise     Pile : Configuration → Tableau de bord → Opérations · Ajout · Budget
    └── Rapports       Rapport mensuel
```

La période (mois) est partagée par le tableau de bord, les opérations, le budget et le rapport. Le budget affiche automatiquement la variante « dépassement » lorsque les dépenses dépassent le budget global.

## Règles métier appliquées (cahier des charges § 5 et § 7)

* Budget **global mensuel unique** (pas d'enveloppes par catégorie).
* **Résultat estimé** (recettes − dépenses) et **trésorerie estimée** (solde initial + encaissements − décaissements) sont deux indicateurs distincts.
* **Budget restant** = budget − dépenses ; une valeur négative signale un dépassement.
* **Étiquettes** facultatives, multiples, créées librement ; elles servent au filtre (au moins une étiquette correspondante) et ne modifient aucun calcul.
* Une opération exige un type, un montant strictement positif, une date comprise entre le début du suivi et aujourd'hui, et une catégorie. Les catégories varient selon le secteur.

## Ce qui reste à brancher

* **Authentification** : `sessionStore` est en mémoire, toute adresse e-mail valide ouvre l'application (`TODO(auth)`).
* **Persistance et API** : les données sont perdues à la fermeture de l'application (critère R9). Remplacer `businessStore` par les appels API en conservant son interface, puis supprimer `src/mocks/`.
* **Workflow A** : écrans 03 à 06 de la maquette.
* **Mode sombre** : la palette et le sélecteur (`ThemeToggle`) existent, mais aucun écran ne l'expose et la maquette est uniquement claire.
* **Tests** : les fonctions de `src/domain` sont prêtes à être testées unitairement.
* **Icônes et écran de démarrage** : toujours ceux du template, à remplacer par le logo Biznova. Identifiants `com.company.apptemplate` à remplacer par ceux de l'équipe avant toute publication.

## Builds Android

Le projet cible Android 7.0+ (API 24).

```bash
# Build local
pnpm prebuild                       # génère android/
pnpm build:android:local:debug      # APK de debug
pnpm build:android:local:release    # APK de release

# Build cloud (EAS)
npm install -g eas-cli && eas login
eas build -p android --profile preview      # APK de test interne
eas build -p android --profile production
```

## Licence

MIT.
