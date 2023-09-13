import React, { useContext } from 'react';
import { RecipeResultsContext, TogglePageContext, RecipeIndexContext } from './App.jsx';


const Recipe = () => {

  const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);
  const [recipeIndex, setRecipeIndex] = useContext(RecipeIndexContext);
  const [page, setPage] = useContext(TogglePageContext);

  return (
    <div>
      <h2>Recipe</h2>
      {recipeResults[recipeIndex].name}
    </div>
  )
}

export default Recipe;