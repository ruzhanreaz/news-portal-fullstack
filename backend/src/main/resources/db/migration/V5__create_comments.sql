CREATE TABLE IF NOT EXISTS comments (
    id        BIGSERIAL PRIMARY KEY,
    text      TEXT         NOT NULL,
    user_id   BIGINT REFERENCES users (id),
    news_id   BIGINT REFERENCES news (id) ON DELETE CASCADE,
    timestamp VARCHAR(255)
);
