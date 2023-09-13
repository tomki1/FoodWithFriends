import React, { useContext, useEffect } from 'react';
import { FoodQueryContext, RecipeResultsContext } from './App.jsx';
import axios from 'axios';
import RecipeResults from './RecipeResults.jsx';



const RecipeSearch = () => {

 const [foodQuery, setFoodQuery] = useContext(FoodQueryContext);
 const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);

 useEffect(() => {
  // This function will run whenever recipeResults changes.
  console.log('recipeResults has been updated:', recipeResults);

  // You can perform any additional actions here based on the updated recipeResults.
}, [recipeResults]);

 const getRecipes = (foodName) => {
  console.log(foodName);

    const options = {
      method: 'GET',
      url: '/recipes',
      responseType: 'json',
      params: {
        foodName
      }
    }
      axios(options)
      .then((response) => {
        setRecipeResults(response.data.results);
      })
      .catch((error) => console.log('Error', error.message));
    }

  return (
    <div>
      <h2>Search for Recipe</h2>
      <input type='text' onChange={(e) => setFoodQuery(e.target.value)}></input>
      <button onClick={() => getRecipes(foodQuery)}>Search Recipes</button>
      {recipeResults.length > 0
      ? <RecipeResults/>
      : null
    }

    </div>
  )
}

export default RecipeSearch;