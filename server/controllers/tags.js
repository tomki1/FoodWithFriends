const { pool } = require('../../db/db.js');
const axios = require('axios');


module.exports = {

  async getTypes(req, res) {
    const options = {
      method: 'GET',
      url: 'https://tasty.p.rapidapi.com/tags/list',
      headers: {
        'X-RapidAPI-Key': `${process.env.TOKEN}`,
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
      }
    };
   axios(options)
    .then((response) => {
      res.send(response.data);
    })
    .catch ((error) => {
      console.error(error);
    });
  }
}

