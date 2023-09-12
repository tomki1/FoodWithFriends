import React, { useContext } from 'react';
import { Context } from './App.jsx';
import axios from 'axios';



const RecipeSearch = () => {

 const [foodQuery, setFoodQuery] = useContext(Context);

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
        console.log("response in client:", response.data);
      })
      .catch((error) => console.log('Error', error.message));
    }

  return (
    <div>
      <h2>Search for Recipe</h2>
      <input type='text' onChange={(e) => setFoodQuery(e.target.value)}></input>
      <button onClick={() => getRecipes(foodQuery)}>Search Recipes</button>
    </div>
  )
}

export default RecipeSearch;