DROP TABLE IF EXISTS match, users, match_users, user_recipes CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) NOT NULL
);
CREATE TABLE user_recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  recipe_id VARCHAR(16) NOT NULL,
  recipe_name VARCHAR(164) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE match (
  id SERIAL PRIMARY KEY,
  recipe_id VARCHAR(16) NOT NULL,
  recipe_name VARCHAR(164) NOT NULL,
  user_1_photo TEXT NOT NULL,
  user_2_photo TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_1_id INTEGER NOT NULL,
  user_2_id INTEGER NOT NULL,
  FOREIGN KEY (user_1_id) REFERENCES users(id),
  FOREIGN KEY (user_2_id) REFERENCES users(id)
);

CREATE TABLE match_users (
  id SERIAL PRIMARY KEY,
  user_1_id INTEGER NOT NULL,
  user_2_id INTEGER NOT NULL,
  FOREIGN KEY (user_1_id) REFERENCES users(id),
  FOREIGN KEY (user_2_id) REFERENCES users(id)
);
