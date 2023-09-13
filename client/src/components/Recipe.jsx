import React, { useContext } from 'react';
import { RecipeResultsContext, TogglePageContext, RecipeIndexContext } from './App.jsx';


const Recipe = () => {

  const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);
  const [recipeIndex, setRecipeIndex] = useContext(RecipeIndexContext);
  const [page, setPage] = useContext(TogglePageContext);

  return (
    <div>
      <button onClick={() => {
        setPage('home');
        setRecipeIndex(-1);
      }}>
        back to recipe list
      </button>
      <button onClick={() => {
      }}>
        select recipe
      </button>
      <h2>{recipeResults[recipeIndex].name}</h2>
      <img src={recipeResults[recipeIndex].thumbnail_url} alt={recipeResults[recipeIndex].name} style={{maxWidth:'500px', maxHeight:'400px'}}></img>
      <p>Ingredients:</p>
      <ul>
        {recipeResults[recipeIndex].sections[0].components.map((recipeIngredients, i) => (
          <li key={i}>{recipeIngredients.ingredient.name}</li>
        ))}
      </ul>
      <p>Instructions:</p>
      <ol>
        {recipeResults[recipeIndex].instructions.map((instruction, i) => (
          <li key={i}>{instruction.display_text}</li>
        ))}
      </ol>
    </div>
  )
}

export default Recipe;