const axios = require('axios');


module.exports = {

  async getRecipes(req, res) {
    console.log("query from client:", req.query.foodName);
    const options = {
      method: 'GET',
      url: 'https://tasty.p.rapidapi.com/recipes/list',
      params: {
        from: '0',
        size: '20',
        tags: 'under_30_minutes',
        q: `${req.query.foodName}`
      },
      headers: {
        'X-RapidAPI-Key': `${process.env.TOKEN}`,
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

}
}