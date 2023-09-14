import React, { useState, useContext, useEffect } from 'react';
import { TogglePageContext, RecipeIDContext, SecondUserContext, RecipeResultsContext, RecipeNameContext } from './App.jsx';
import axios from 'axios';



const Fight = () => {

  const [page, setPage] = useContext(TogglePageContext);
  const [recipeID, setRecipeID] = useContext(RecipeIDContext);
  const [secondUser, setSecondUser] = useContext(SecondUserContext);
  const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);
  const [recipeName, setRecipeName] = useContext(RecipeNameContext);

  const [isLoading, setIsLoading] = useState(true);

  const getRecipe = () => {
    setIsLoading(true);
    const options = {
      method: 'GET',
      url: '/recipe',
      responseType: 'json',
      params: {
        recipeID,
        secondUser
      }
    }
      axios(options)
      .then((response) => {
        setRecipeResults(response.data);
        console.log(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.log('Error', error.message));
    }

    useEffect(() => {
      getRecipe();
      console.log('recipeResults has been updated:', recipeResults);
    }, []);

    useEffect(() => {
      console.log('recipeResults has been updated:', recipeResults);
    }, [recipeResults]);
  return (
    <div>
      <button onClick={() => {
        setPage('home');
      }}>
        Search
      </button>
      <button onClick={() => {
        setPage('feed');
      }}>
        Feed
      </button>
      <button onClick={() => {
        setPage('userRecipes');
      }}>
        Your Saved Recipes
      </button>
      <button onClick={() => {
        setPage('match');
      }}>
        Food Fight
      </button>
      <h2>Get Cooking!</h2>

      <button onClick={() => {
        setPage('viewMatch');
      }}>
        View Match
      </button>
      {isLoading ? null :
      <>
       <h2>{recipeResults?.name}</h2>
       <img src={recipeResults?.thumbnail_url} alt={recipeResults?.name} style={{maxWidth:'500px', maxHeight:'400px'}}></img>


       {recipeResults.prep_time_minutes ?
         <p>Prep Time: {recipeResults.prep_time_minutes} minutes</p>
       : <p>Prep Time: none listed</p>
       }

       {recipeResults.cook_time_minutes ?
         <p>Cook Time: {recipeResults.cook_time_minutes} minutes</p>
       : <p>Cook Time: none listed</p>
       }

       <p>Ingredients:</p>
       {recipeResults.sections[0].components ?
         <ul>
           {recipeResults.sections[0].components.map((recipeIngredients, i) => (
             <li key={i}>{recipeIngredients.raw_text}</li>
           ))}
         </ul>
       : <p>none listed</p>}

       <p>Instructions:</p>
       {recipeResults.instructions ?
         <ol>
         {recipeResults.instructions.map((instruction, i) => (
           <li key={i}>{instruction.display_text}</li>
         ))}
       </ol>
       : <p>none listed</p>}
       </>}

    </div>
  )
}

export default Fight;