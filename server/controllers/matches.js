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

      let user_id_1;
      let user_id_2;
      if (userResult1.rows[0].id < userResult2.rows[0].id) {
         user_id_1 = userResult1.rows[0].id;
         user_id_2 = userResult2.rows[0].id;
      } else {
         user_id_2 = userResult1.rows[0].id;
         user_id_1 = userResult2.rows[0].id;
      }

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

      let user_id_1;
      let user_id_2;
      if (userResult1.rows[0].id < userResult2.rows[0].id) {
         user_id_1 = userResult1.rows[0].id;
         user_id_2 = userResult2.rows[0].id;
      } else {
         user_id_2 = userResult1.rows[0].id;
         user_id_1 = userResult2.rows[0].id;
      }

      const result = await pool.query('SELECT m.recipe_name, m.user_1_photo as user_1_photo, m.user_2_photo AS user_2_photo, u1.username AS username_1, u2.username as username_2 FROM match m INNER JOIN users u1 ON m.user_1_id = u1.id INNER JOIN users u2 ON m.user_2_id = u2.id WHERE recipe_id = $1 AND user_1_id = $2 AND user_2_id = $3', [recipe_id, user_id_1, user_id_2]);
      const imageBase64_1 = result.rows[0]?.user_1_photo;
      const imageBase64_2 = result.rows[0]?.user_2_photo;
      const username_1 = result.rows[0]?.username_1;
      const username_2 = result.rows[0]?.username_2;
      res.status(200).json({ imageData_1: imageBase64_1, imageData_2: imageBase64_2, username_1: username_1, username_2: username_2});
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error' });
    }
  },

  async updateMatch(req, res) {

    const recipe_id = req.body.recipeID;
    const username = req.body.currentUser;
    const secondUser = req.body.secondUser;
    const imageData = req.body.imageData;

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

      let user_id_1;
      let user_id_2;
      let result;
      if (userResult1.rows[0].id < userResult2.rows[0].id) {
        // update photo 1
         user_id_1 = userResult1.rows[0].id;
         user_id_2 = userResult2.rows[0].id;

        result = await pool.query('UPDATE match SET user_1_photo = $1 WHERE recipe_id = $2 AND user_1_id = $3 AND user_2_id = $4', [imageData, recipe_id, user_id_1, user_id_2]);

      } else {
        // update photo 2
         user_id_2 = userResult1.rows[0].id;
         user_id_1 = userResult2.rows[0].id;
         result = await pool.query('UPDATE match SET user_2_photo = $1 WHERE recipe_id = $2 AND user_1_id = $3 AND user_2_id = $4', [imageData, recipe_id, user_id_1, user_id_2]);
      }

      console.log("updated")
      return res.status(200).send(result);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error' });
    }
  }


}