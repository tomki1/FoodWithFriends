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



  }


}