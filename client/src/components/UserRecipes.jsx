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
    <div className="user-recipes">
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
        setPage('match');
      }}>
        Food Fight
      </button>
      <h2>Your Saved Recipes</h2>


      <div class="user-recipe-list">
        {userRecipeData.map((oneRecipe, index) => (
            <ul key={index}>{oneRecipe.recipe_name}</ul>
          ))}
      </div>

    </div>
  )
}

export default UserRecipes;