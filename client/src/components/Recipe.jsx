import React, { useContext } from 'react';
import { RecipeResultsContext, TogglePageContext, RecipeIndexContext } from './App.jsx';
import axios from 'axios';


const Recipe = () => {

  const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);
  const [recipeIndex, setRecipeIndex] = useContext(RecipeIndexContext);
  const [page, setPage] = useContext(TogglePageContext);

  const addRecipe = () => {
    const options = {
      method: 'POST',
      url: '/recipes/add',
      responseType: 'json',
      params: {
        id: recipeResults[recipeIndex].id,
        name: recipeResults[recipeIndex].name,
        username: sessionStorage.getItem('username')
        // prepTime: recipeResults[recipeIndex].prep_time_minutes,
        // cookTime: recipeResults[recipeIndex].cook_time_minutes,
        // image: recipeResults[recipeIndex]?.thumbnail_url,
        // ingredients: recipeResults[recipeIndex].sections[0].components,
        // instructions: recipeResults[recipeIndex].instructions
      }
    }
    axios(options)
    .then((response) => {

      setPage('userRecipes');

    })
    .catch((error) => console.log('Error', error.message));



  }

  return (
    <div>
      <button onClick={() => {
        setPage('home');
        setRecipeIndex(-1);
      }}>
        back to recipe list
      </button>
      <button onClick={() => {addRecipe()}}>
        select recipe
      </button>
      <h2>{recipeResults[recipeIndex]?.name}</h2>
      <img src={recipeResults[recipeIndex]?.thumbnail_url} alt={recipeResults[recipeIndex]?.name} style={{maxWidth:'500px', maxHeight:'400px'}}></img>


      {recipeResults[recipeIndex].prep_time_minutes ?
        <p>Prep Time: {recipeResults[recipeIndex].prep_time_minutes} minutes</p>
      : <p>Prep Time: none listed</p>
      }

      {recipeResults[recipeIndex].cook_time_minutes ?
        <p>Cook Time: {recipeResults[recipeIndex].cook_time_minutes} minutes</p>
      : <p>Cook Time: none listed</p>
      }

      <p>Ingredients:</p>
      {recipeResults[recipeIndex].sections[0] ?
        <ul>
          {recipeResults[recipeIndex].sections[0].components.map((recipeIngredients, i) => (
            <li key={i}>{recipeIngredients.ingredient.name}</li>
          ))}
        </ul>
      : <p>none listed</p>}

      <p>Instructions:</p>
      {recipeResults[recipeIndex].instructions ?
        <ol>
        {recipeResults[recipeIndex].instructions.map((instruction, i) => (
          <li key={i}>{instruction.display_text}</li>
        ))}
      </ol>
      : <p>none listed</p>}

    </div>
  )
}

export default Recipe;