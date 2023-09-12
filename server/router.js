const express = require('express');

const router = express.Router();
const controller = require('./controllers');

router.get('/recipes', controller.recipes.getRecipes);


module.exports = router;