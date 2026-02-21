CREATE TABLE IF NOT EXISTS users (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS news (
    id        BIGSERIAL PRIMARY KEY,
    title     VARCHAR(255) NOT NULL,
    body      TEXT         NOT NULL,
    author_id BIGINT REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS comments (
    id       BIGSERIAL PRIMARY KEY,
    text     TEXT         NOT NULL,
    user_id  BIGINT REFERENCES users (id),
    news_id  BIGINT REFERENCES news (id) ON DELETE CASCADE,
    timestamp VARCHAR(255)
);
