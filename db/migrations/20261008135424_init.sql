-- migrate:up
CREATE TABLE public.users (
    id  UUID PRIMARY KEY DEFAULT uuidv7(),
    elo INTEGER NOT NULL DEFAULT 500,
    first_name  TEXT NOT NULL,
    last_name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio TEXT,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.games (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    location POINT NOT NULL,
    name TEXT NOT NULL,
    code varchar(6) NOT NULL,
    players SMALLINT NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone
);

CREATE TABLE public.users_games (
    is_creator BOOLEAN NOT NULL,
    finished_place INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, game_id)
);

CREATE INDEX idx_users_games_game_id ON users_games (game_id); 

CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    token_hash TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at timestamp with time zone NOT NULL DEFAULT now() + INTERVAL '24 weeks',
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id); 

-- migrate:down

