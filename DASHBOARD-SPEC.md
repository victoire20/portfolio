# Spécification — dashboard d’administration des projets

## 1. Objectif

Ajouter un dashboard privé pour gérer les projets du portfolio et les liens vers
les réseaux sociaux, sans remplacer le framework actuel. Les données saisies
doivent alimenter les pages publiques ; le dashboard ne doit pas être une
interface isolée qui ne sauvegarde que dans le navigateur.

## 2. Stack retenue

- **Interface publique et dashboard** : React, TypeScript, Vite et Tailwind CSS,
  déjà présents dans le projet.
- **Authentification, API et base de données** : Supabase Auth et PostgreSQL
  Supabase.
- **Images** : Cloudinary, avec téléversement depuis le dashboard et stockage en
  base de données des URL et identifiants d’assets, pas des fichiers image.
- **Accès admin** : compte créé/invité par le propriétaire, sans inscription
  publique. Le dashboard est accessible par une route dédiée (par exemple
  `/admin`), mais la route cachée n’est jamais considérée comme une protection.

Aucun changement de framework n’est nécessaire. Les clés publiques de Supabase
et les identifiants non secrets Cloudinary peuvent être utilisés côté client.
Les secrets Supabase `service_role`, Cloudinary API secret et tout secret de
signature restent exclusivement côté serveur / fonctions Supabase.

## 3. Modèle de projet

Le formulaire de création et de modification reprend les informations déjà
consommées par `ProjectCard` et définies dans `src/types/project.ts` et
`src/data/projects.ts` :

| Champ | Type / règle | Correspondance actuelle |
|---|---|---|
| `title` | texte requis | `title` |
| `description` | texte requis | `description` |
| `skills` | liste de textes ; au moins un élément | `skills: string[]` |
| `cover_url` | URL Cloudinary nullable | `cover` ; facultative notamment pour les petits projets |
| `live_url` | URL nullable | `liveUrl` |
| `github_url` | URL nullable | `githubUrl` |
| `is_private` | booléen, défaut `false` | `isPrivate` |
| `is_small_project` | booléen, défaut `false` | `isSmallProject` |
| `design_url` | URL nullable | `maquette.url` |
| `design_support` | texte nullable | `maquette.support` |
| `gallery` | liste d’URL Cloudinary, défaut vide | `gallery?: string[]` |
| `is_published` | booléen, défaut `false` | nouveau contrôle de visibilité publique |
| `sort_order` | entier, défaut en dernière position | nouvel ordre manuel d’affichage |
| `created_at`, `updated_at` | horodatages gérés par la base | nouveaux champs d’audit |

`id` sera généré par PostgreSQL (UUID), plutôt que saisi par l’admin ou basé sur
les identifiants numériques actuellement codés en dur. Les projets non publiés
ne seront pas renvoyés aux visiteurs. Le statut privé (`is_private`) décrit le
projet ; la visibilité sur le portfolio sera déterminée explicitement par
`is_published`.

Le formulaire permettra d’ajouter/retirer les compétences et les images de
galerie, de téléverser/remplacer/supprimer la couverture Cloudinary, de définir
les URL de démo, dépôt et maquette, et de choisir si le projet est petit ou
complet. Les champs suivent les distinctions déjà visibles : les petits projets
n’affichent pas de couverture dans `ProjectCard`, tandis que les projets
complets ont une image et les liens disponibles.

### Table PostgreSQL `projects`

Colonnes prévues : `id uuid primary key`, champs de projet ci-dessus,
`skills text[] not null default '{}'`, `gallery text[] not null default '{}'`,
`sort_order integer not null default 0`, `is_published boolean not null default
false`, et `created_at` / `updated_at` en `timestamptz`.

Des contraintes de validation seront ajoutées côté formulaire et base autant
que possible : titre non vide, URL valides lorsqu’elles sont présentes,
booléens non nuls, valeurs par défaut cohérentes. Le frontend ne sera pas la
seule couche de validation.

## 4. Réseaux sociaux

Les liens sociaux seront configurés depuis une ligne unique dans une table
`social_networks` (profil du portfolio). Pour correspondre à la demande, chaque
plateforme est un champ/attribut distinct et **nullable** : une plateforme non
renseignée n’empêche jamais de créer ou sauvegarder la ligne. Le formulaire
affichera ces champs comme facultatifs et n’affichera sur le site que les liens
renseignés.

Plateformes prévues pour un portfolio de développeur :

- `github_url`, `gitlab_url`, `bitbucket_url`, `codeberg_url`, `sourcehut_url`
- `devto_url`, `hashnode_url`, `medium_url`, `substack_url`, `blog_url`
- `stackoverflow_url`, `reddit_url`, `github_discussions_url`
- `linkedin_url`, `x_url`, `bluesky_url`, `mastodon_url`, `threads_url`
- `discord_url`, `telegram_url`, `youtube_url`, `twitch_url`
- `npm_url`, `pypi_url`, `docker_hub_url`, `huggingface_url`, `codepen_url`,
  `codesandbox_url`, `stackblitz_url`, `replit_url`, `leetcode_url`,
  `codewars_url`, `topcoder_url`
- `figma_url`, `behance_url`, `dribbble_url`, `personal_website_url`

La liste couvre les plateformes courantes, mais ne peut pas garantir littéralement
« tous » les services existants : ils évoluent et sont innombrables. Le modèle
prévoira donc aussi une possibilité d’ajouter ultérieurement une plateforme
personnalisée (nom, URL, icône/clé d’icône, ordre et visibilité), sans migration
de schéma à chaque nouveau réseau. Les valeurs des plateformes listées resteront
facultatives.

La table est une configuration singleton : une ligne pour le portfolio, avec
contrôle d’accès empêchant la création de plusieurs profils par le dashboard.
Prévoir `id`, les colonnes d’URL facultatives, `custom_links jsonb not null
default '[]'`, `updated_at` et une contrainte garantissant l’unicité du profil.

## 5. Sécurité et accès

- Désactiver l’inscription publique de Supabase Auth ; créer/inviter le compte
  administrateur depuis l’environnement Supabase.
- Protéger l’interface `/admin` par une session Supabase et rediriger vers la
  connexion si aucune session active.
- Activer **RLS** sur toutes les tables. Les visiteurs peuvent lire uniquement
  les projets publiés et les liens sociaux publiquement affichables ; seuls les
  utilisateurs authentifiés explicitement autorisés (rôle admin) peuvent créer,
  modifier ou supprimer les données.
- Ne jamais faire confiance à la seule protection de route côté React. Les
  politiques RLS sont la frontière d’autorisation de la base.
- Ne jamais inclure la clé `service_role` ou le secret Cloudinary dans les
  variables `VITE_*` ou le bundle frontend.
- Restreindre les téléversements Cloudinary aux formats image autorisés, à une
  taille maximale définie, et à un dossier dédié. Utiliser un téléversement
  signé via une fonction serveur/Supabase si la configuration Cloudinary le
  permet ; ne pas exposer l’API secret.
- Utiliser des requêtes paramétrées via le client Supabase officiel, valider les
  URL et les champs, et afficher les erreurs de sauvegarde sans faux succès.
- Prévoir déconnexion, expiration/renouvellement de session gérés par Supabase
  et protection contre les liens sociaux non sûrs (HTTPS lorsque pertinent).

## 6. Écrans du dashboard

1. **Connexion** : lien de connexion ou mot de passe selon la configuration
   Supabase retenue ; aucun formulaire d’inscription.
2. **Projets** : liste filtrable (publié/brouillon, petit/complet), ordre,
   édition, duplication éventuelle et suppression avec confirmation.
3. **Créer / modifier un projet** : champs du modèle ci-dessus, aperçu de la
   couverture et validation avant sauvegarde.
4. **Réseaux sociaux** : formulaire des champs facultatifs et liens personnalisés.
5. **État de session** : identité admin et bouton de déconnexion.

L’interface reste cohérente avec l’architecture actuelle : composants React
réutilisables, types TypeScript pour les lignes PostgreSQL et styles Tailwind
CSS. Le dashboard peut partager le même build Vite et la même application,
séparé par routes, sans mélanger son interface avec les pages publiques.

## 7. Intégration au site actuel

Aujourd’hui, les pages importent les projets depuis `src/data/projects.ts`.
L’implémentation devra remplacer cette source statique par une lecture Supabase
des projets publiés, tout en conservant le contrat consommé par `ProjectCard`
(`title`, `description`, `skills`, image, liens, maquette, type petit/complet).
Une conversion explicite entre noms PostgreSQL (`snake_case`) et propriétés
TypeScript actuelles (`camelCase`) évitera de propager des changements partout.

Le chargement doit préserver les deux listes et leurs tris actuels : les projets
complets dans les sections projets, les petits projets dans leur section, et la
limite des trois premiers sur l’accueil. Les erreurs réseau doivent être
visibles et ne pas se transformer silencieusement en liste vide. Une stratégie
temporaire de fallback vers les données actuelles pourra être utilisée pendant
la migration, mais devra être retirée ou documentée explicitement avant mise en
production afin d’éviter des données incohérentes.

Les réseaux sociaux seront lus depuis leur configuration Supabase et affichés
uniquement si une URL existe. Les valeurs actuellement codées dans
`Header.tsx`, `Footer.tsx`, `HeadSocial.tsx` et `Contact.tsx` devront être
remplacées par cette configuration à l’implémentation.

## 8. Configuration et déploiement

Variables frontend attendues, par exemple :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (clé `sb_publishable_...`, destinée au
  frontend). Les anciens projets peuvent encore afficher une clé `anon`, mais
  Supabase recommande désormais la clé publishable.
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET` uniquement si preset non signé autorisé et
  strictement limité ; sinon utiliser le mécanisme de signature côté serveur.

Pour les téléversements signés, `CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>`
peut être défini dans l’environnement serveur si le SDK Cloudinary l’utilise.
Cette variable contient le secret API : elle ne doit jamais être préfixée par
`VITE_`, envoyée au navigateur ou ajoutée au dépôt. Dans Supabase, la configurer
comme secret d’Edge Function (ou comme variable secrète du backend), pas comme
variable frontend. Les secrets Supabase `service_role` / `secret` suivent la
même règle.

Les migrations SQL, politiques RLS et contraintes doivent être versionnées dans
le projet. Les secrets locaux doivent être ignorés par Git et un fichier
d’exemple ne contient que des valeurs fictives.

## 9. Plan d’implémentation

- [ ] Confirmer le schéma final des champs et noms du modèle projets.
- [ ] Créer le projet Supabase, désactiver l’inscription publique et créer
  l’accès admin.
- [ ] Écrire les migrations des tables `projects` et `social_networks`.
- [ ] Activer et tester les politiques RLS (lecture publique limitée, écriture
  admin uniquement).
- [ ] Configurer Cloudinary et le mécanisme de téléversement sécurisé.
- [ ] Ajouter le client Supabase typé, la validation de formulaires et la
  conversion DB ↔ modèle frontend.
- [ ] Construire la route et les écrans du dashboard avec Tailwind CSS.
- [ ] Connecter la lecture publique Supabase aux sections de projets et réseaux.
- [ ] Migrer les données actuelles sans perte et vérifier le rendu des cartes.
- [ ] Tester non-authentifié, admin, champs optionnels, URL invalides,
  téléversement, erreur réseau et suppression.
- [ ] Documenter les variables d’environnement et les étapes de déploiement.

## 10. Hors périmètre de cette spécification

Ce fichier décrit la stack et le comportement attendus ; il ne crée pas de
projet Supabase ou Cloudinary, ne déploie pas de service et ne contient aucune
clé ou donnée d’identification réelle. Le coût, les quotas, le stockage et le
mode exact de connexion devront être confirmés lors de la mise en place.
