# PinteFlush-back

Backend pour le projet PinteFlush, une application de poker en réalité augmentée. M2 DevIoT, Ynov Nantes

# Initialisation

0. Configuration : copier `.env.example` en `.env` et renseigner les valeurs (`JWT_SECRET` : 32 caractères minimum). L'API refuse de démarrer si une variable manque.

1. Création du volume db

```bash
docker volume create pinte_flush_data
```

2. Création db

```bash
docker compose up -d
```

3. Lancement des migrations

```bash
npm run db:migrate
```

# API

Toutes les réponses suivent le format `{ success: true, data }` ou `{ success: false, error }`.
L'authentification passe par des cookies httpOnly : `access_token` (JWT, 1h) et `refresh_token` (opaque, 24 semaines, à usage unique, envoyé uniquement sur `/api/renew`).

| Méthode | Route                 | Auth | Description                                             |
| ------- | --------------------- | ---- | ------------------------------------------------------- |
| POST    | `/api/register`       | non  | `{ email, password, firstName, lastName }` → 201 `{ id }` |
| POST    | `/api/login`          | non  | `{ email, password }` → pose les cookies                |
| POST    | `/api/renew`          | non  | Renouvelle les deux cookies (rotation du refresh token) |
| POST    | `/api/auth/logout`    | oui  | Révoque toutes les sessions de l'utilisateur            |
| GET     | `/api/auth/user/me`   | oui  | Profil complet de l'utilisateur connecté                |
| GET     | `/api/auth/user/:id`  | oui  | Profil public (sans email, sauf pour soi-même)          |

`/login`, `/register` et `/renew` sont limités par IP (respectivement 10, 5 et 30 requêtes / 15 min).
