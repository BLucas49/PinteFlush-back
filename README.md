# PinteFlush-back

Backend pour le projet PinteFlush, une application de poker en réalité augmentée. M2 DevIoT, Ynov Nantes.

Serveur [Colyseus](https://docs.colyseus.io/) (temps réel) exposant aussi une API REST Express, adossée à une base PostgreSQL.

## Prérequis

- Node.js **22** ou plus
- Docker et Docker Compose (pour PostgreSQL)

## Installation

```bash
npm install
```

L'installation active automatiquement les hooks Git (Husky), voir [Contribuer](#contribuer).

### 1. Configuration

Copier `.env.example` en `.env` puis renseigner les valeurs :

```bash
cp .env.example .env
```

| Variable                                                  | Rôle                                                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` | Connexion à PostgreSQL (utilisées par l'API et par `docker compose`)                                |
| `DATABASE_URL`                                            | URL de connexion utilisée par `dbmate` pour les migrations. Doit correspondre aux valeurs ci-dessus |
| `JWT_SECRET`                                              | Secret de signature des access tokens, **32 caractères minimum**                                    |
| `ENV`                                                     | `production` active les cookies `Secure` (HTTPS uniquement)                                         |

Pour générer un `JWT_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

> L'API refuse de démarrer si une variable obligatoire manque ou si `JWT_SECRET` est trop court.

### 2. Base de données

```bash
# Création du volume (une seule fois, il est déclaré "external" dans compose.yaml)
docker volume create pinte_flush_data

# Démarrage de PostgreSQL 18 sur le port 5432
docker compose up -d

# Application des migrations
npm run db:migrate
```

> Si un pgsql est déjà lancé sur la machine cela peut bloquer les migrations

## Lancement

```bash
npm start
```

Le serveur démarre en mode watch sur **http://localhost:2567** (modifiable via la variable `PORT`) :

- API REST : `http://localhost:2567/api`
- Playground Colyseus : `http://localhost:2567/playground`

### Build de production

```bash
npm run build                 # compile dans build/
ENV=production node build/index.js
```

## Scripts

| Commande                          | Description                                                |
| --------------------------------- | ---------------------------------------------------------- |
| `npm start`                       | Serveur en mode watch (`tsx`)                              |
| `npm run build`                   | Compilation TypeScript dans `build/`                       |
| `npm test`                        | Tests Mocha (`test/`)                                      |
| `npm run lint` / `lint:fix`       | ESLint                                                     |
| `npm run format` / `format:check` | Prettier sur `src/`                                        |
| `npm run db:new <nom>`            | Crée un nouveau fichier de migration dans `db/migrations/` |
| `npm run db:migrate`              | Applique les migrations en attente                         |
| `npm run db:rollback`             | Annule la dernière migration                               |
| `npm run loadtest`                | Test de charge Colyseus (2 clients sur `my_room`)          |

## Structure

```
src/
├── index.ts               # Point d'entrée (listen Colyseus)
├── app.config.ts          # Rooms, routes et montage de l'API Express
├── rooms/                 # Rooms Colyseus et leurs states
└── backend/
    ├── core/              # Base (Controller, Service, Repository…), config, middlewares, utils
    ├── db/                # Modèles et repositories (Users, Sessions, Games)
    ├── packages/          # Modules métier : routes / controller / service / dto
    │   ├── auth/
    │   └── user/
    └── routes/            # Routeurs publics et protégés
db/migrations/             # Migrations SQL (dbmate)
```

## Contribuer

### Convention de commit

Le hook `commit-msg` impose le format :

```
FEATURE - description
```

- `FEATURE` en MAJUSCULES (lettres, `_` ou `-`), par exemple `TECH`, `AUTH`, `GAME`
- description de 7 à 60 caractères

Exemple : `TECH - Mise en place de l'api`

### Hooks et CI

- **pre-commit** : lance `npm run format` (Prettier). Pensez à re-stager les fichiers reformatés.
- **CI** (GitHub Actions, sur les pull requests vers `main`) : `lint`, `format:check` et `build` sous Node 22.
