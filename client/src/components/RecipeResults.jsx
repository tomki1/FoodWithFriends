import React, { useContext, useEffect } from 'react';
import { RecipeResultsContext } from './App.jsx';
import RecipeEntry from './RecipeEntry.jsx';


const RecipeResults = () => {

  const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);

  useEffect(() => {
    // This function will run whenever recipeResults changes.
    console.log('recipeResults has been updated:', recipeResults);

    // You can perform any additional actions here based on the updated recipeResults.
  }, [recipeResults]);

  return (
    <div>
      <h2>Recipe Results</h2>
      {recipeResults.length > 0
      ? recipeResults.map((recipe, index) => (
        <RecipeEntry key={index} index={index}/>
        ))
      : null}

    </div>
  )
}

export default RecipeResults;