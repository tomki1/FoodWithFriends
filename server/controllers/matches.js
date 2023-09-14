const { pool } = require('../../db/db.js');
const axios = require('axios');


module.exports = {

  async addMatch(req, res) {
    console.log(req.query);
    console.log("in add match");
    const recipe_id = req.query.recipeID;
    const recipe_name = req.query.recipeName;
    const username = req.query.currentUser;
    const secondUser = req.query.secondUser;

    try {
      const userResult1 = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
      if (userResult1.rows.length === 0) {
        console.error('User not found');
        return res.status(404).json({ error: 'User not found' });
      }

      const userResult2 = await pool.query('SELECT id FROM users WHERE username = $1', [secondUser]);
      if (userResult2.rows.length === 0) {
        console.error('Second user not found');
        return res.status(404).json({ error: 'Second user not found' });
      }

      const user_id_1 = userResult1.rows[0].id;
      const user_id_2 = userResult2.rows[0].id;

      const insertResult = await pool.query('INSERT INTO match (recipe_id, recipe_name, user_1_id, user_2_id) VALUES ($1, $2, $3, $4)', [recipe_id, recipe_name, user_id_1, user_id_2]);

      console.log('match inserted');
      return res.status(201).json({ message: 'match inserted' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error' });
    }
  },

  async getMatch(req, res) {

    const recipe_id = req.query.recipeID;
    const username = req.query.currentUser;
    const secondUser = req.query.secondUser;
    try {
      const userResult1 = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
      if (userResult1.rows.length === 0) {
        console.error('User not found');
        return res.status(404).json({ error: 'User not found' });
      }

      const userResult2 = await pool.query('SELECT id FROM users WHERE username = $1', [secondUser]);
      if (userResult2.rows.length === 0) {
        console.error('Second user not found');
        return res.status(404).json({ error: 'Second user not found' });
      }

      const user_id_1 = userResult1.rows[0].id;
      const user_id_2 = userResult2.rows[0].id;

      const result = await pool.query('SELECT * from match WHERE recipe_id = $1 AND (user_1_id = $2 AND user_2_id = $3) OR (user_1_id = $3 AND user_2_id = $2)', [recipe_id, user_id_1, user_id_2]);
      return res.status(200).send(result.rows[0]);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error' });
    }
  }


}