const { pool } = require('../../db/db.js');
const axios = require('axios');


module.exports = {

  async addUser(req, res) {
    const username = req.query.username;

    pool.query('SELECT id FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        console.error('Error retrieving user ID:', error);
      } else {
        if (results.rows.length > 0) {
          res.send(`Welcome back, ${username}`);
        } else {
          console.log("user not in database")
          pool.query('INSERT INTO users (username) VALUES ($1)', [username], (error, results)  => {
            if (error) {
              console.error('error:', error);
              res.status(500).json({ error: 'error' });
            } else {
              console.log('user inserted');
              res.status(201).send(`Thanks for signing up, ${username}`);
            }
          });
        }
      }
    });



  },

  async getMatches(req, res) {
    const username = req.query.username;
    let user_id;

    if (username !== undefined) {
      const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

      if (userResult.rows.length > 0) {
        user_id = userResult.rows[0].id;
      } else {
        res.send("User not found");
        return;
      }
    } else {
      res.send("Username not provided");
      return;
    }

    pool.query('SELECT ur1.id, ur1.recipe_id as recipe_id, ur1.recipe_name, ur2.user_id as user2, u2.username as user2_username FROM user_recipes ur1 JOIN user_recipes ur2 ON ur1.recipe_name = ur2.recipe_name JOIN users u2 ON ur2.user_id = u2.id WHERE ur1.user_id = $1 AND ur2.user_id <> $1', [user_id], (error, results) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error' });
      } else {
        res.status(200).send(results.rows);
      }
    });

  }


}