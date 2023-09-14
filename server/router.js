const express = require('express');

const router = express.Router();
const controller = require('./controllers');

router.get('/recipes', controller.recipes.getRecipes);
router.get('/tags/types', controller.tags.getTypes);
router.get('/recipes/user', controller.recipes.getUserRecipes);
router.post('/recipes/add', controller.recipes.addRecipe);
router.post('/users/add', controller.users.addUser);


module.exports = router;