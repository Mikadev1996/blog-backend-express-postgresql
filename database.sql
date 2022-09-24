
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(12),
    password TEXT,
--     date_joined DATE,
--     picture_url TEXT
);

CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    text VARCHAR(400),
    likes INTEGER,
    timestamp TIMESTAMP,
    edited BOOLEAN,
    published BOOLEAN,
    user_id INTEGER REFERENCES users (user_id)
);

