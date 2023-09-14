import React, { useState, useContext, useEffect } from 'react';
import { TogglePageContext } from './App.jsx';
import axios from 'axios';


const UserRecipes = () => {

  const [userRecipeData, setUserRecipeData] = useState([]);

  const getUserRecipes = () => {
    const options = {
      method: 'GET',
      url: '/recipes/user',
      responseType: 'json',
      params: {
        username: sessionStorage.getItem('username')
      }
    }
      axios(options)
      .then((response) => {
        console.log("response from db:", response.data);
        setUserRecipeData(response.data);
      })
      .catch((error) => console.log('Error', error.message));

  }

  useEffect(() => {
    getUserRecipes();
    console.log('userRecipeData has been updated:', userRecipeData);
  }, []);

  const [page, setPage] = useContext(TogglePageContext);
  return (
    <div>
      <button onClick={() => {
        setPage('home');
      }}>
        back search page
      </button>
      <h2>Your Saved Recipes</h2>


      {userRecipeData.map((oneRecipe, index) => (
          <ul key={index}>{oneRecipe.recipe_name}</ul>
        ))}

    </div>
  )
}

export default UserRecipes;