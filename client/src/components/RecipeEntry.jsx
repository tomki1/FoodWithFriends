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

  const scrollToTop = () => {
    window.scrollTo(0, 0);
}

  return (
    <div>
      <ul>
        <p onClick={toggleDetails} style={{ cursor: 'pointer' }}>{recipeResults[index]?.name}</p>
        {showDetails && (
        <div>
          <h3>Recipe Details:</h3>
          <button onClick={() => {
            setPage('recipe');
            setRecipeIndex(index);
            scrollToTop();
            }}>
              view recipe
          </button>
          <div>
            <img src={recipeResults[index]?.thumbnail_url} alt={recipeResults[index]?.name} style={{maxWidth:'200px', maxHeight:'200px'}}></img>
          </div>
          {recipeResults[index].description ?
          <p>Description: {recipeResults[index].description}</p>
          : null}



        </div>
      )}
      </ul>

    </div>
  )
}

export default RecipeEntry;