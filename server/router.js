const express = require('express');

const router = express.Router();
const controller = require('./controllers');

router.get('/recipes', controller.recipes.getRecipes);
router.get('/tags/types', controller.tags.getTypes);


module.exports = router;