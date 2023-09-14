const express = require('express');

const router = express.Router();
const controller = require('./controllers');

router.get('/recipes', controller.recipes.getRecipes);
router.get('/recipe', controller.recipes.getRecipe);
router.get('/tags/types', controller.tags.getTypes);
router.get('/recipes/user', controller.recipes.getUserRecipes);
router.get('/users/matches', controller.users.getMatches)
router.get('/matches/get', controller.matches.getMatch);
router.post('/recipes/add', controller.recipes.addRecipe);
router.post('/users/add', controller.users.addUser);
router.post('/matches/add', controller.matches.addMatch);



module.exports = router;