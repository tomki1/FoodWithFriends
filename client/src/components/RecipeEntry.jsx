import React, { useState, useContext } from 'react';
import { RecipeResultsContext, TogglePageContext, RecipeIndexContext } from './App.jsx';

const RecipeEntry = ({ index }) => {

  const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);
  const [page, setPage] = useContext(TogglePageContext);
  const [recipeIndex, setRecipeIndex] = useContext(RecipeIndexContext);

  const [showDetails, setShowDetails] = useState(false);



  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };


  return (
    <div>
      <ul>
        <p onClick={toggleDetails} style={{ cursor: 'pointer' }}>{recipeResults[index].name}</p>
        {showDetails && (
        <div>
          <h3>Recipe Details:</h3>
          <button onClick={() => {
            setPage('recipe');
            setRecipeIndex(index);
            }}>
              view full page
          </button>
          <p>Description: {recipeResults[index].description}</p>
          <p>Ingredients:</p>
          <ul>
            {recipeResults[index].sections[0].components.map((recipeIngredients, i) => (
              <li key={i}>{recipeIngredients.ingredient.name}</li>
            ))}
          </ul>

        </div>
      )}
      </ul>

    </div>
  )
}

export default RecipeEntry;