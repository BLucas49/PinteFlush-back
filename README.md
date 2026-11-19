# PinteFlush-back

Backend pour le projet PinteFlush, une application de poker en réalité augmentée. M2 DevIoT, Ynov Nantes

# Initialisation

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
