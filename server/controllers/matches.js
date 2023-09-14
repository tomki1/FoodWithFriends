const { pool } = require('../../db/db.js');
const axios = require('axios');


module.exports = {

  // async addMatch(req, res) {
  //   const recipe_id = req.query.id;
  //   const recipe_name = req.query.name;
  //   const username = req.query.username;

  //   let user_id;
  //   pool.query('SELECT id FROM users WHERE username = $1', [username], (error, results) => {
  //     if (error) {
  //       console.error('Error retrieving user ID:', error);
  //     } else {
  //       if (results.rows.length > 0) {
  //         user_id = results.rows[0].id;
  //       } else {
  //         console.error('User not found');
  //       }
  //     }
  //   });

  //   pool.query('INSERT INTO user_recipes (recipe_id, recipe_name, user_id) VALUES ($1, $2, $3)', [recipe_id, recipe_name, user_id], (error, results)  => {
  //     if (error) {
  //       console.error('error:', error);
  //       res.status(500).json({ error: 'error' });
  //     } else {
  //       console.log('recipe inserted');
  //       res.status(201).json({ message: 'recipe inserted' });
  //     }
  //   });

  // }


}