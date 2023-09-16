import React, { useState, useContext, useEffect } from 'react';
import { TogglePageContext, RecipeIDContext, RecipeNameContext } from './App.jsx';
import axios from 'axios';


const UserRecipes = () => {

  const [userRecipeData, setUserRecipeData] = useState([]);
  const [recipeID, setRecipeID] = useContext(RecipeIDContext);
  const [recipeName, setRecipeName] = useContext(RecipeNameContext);

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

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  const clickHandler = (recipe_id, recipe_name) => {
    setRecipeID(recipe_id);
    setRecipeName(recipe_name);
    setPage('savedFeedRecipe');
    scrollToTop();
  }

  useEffect(() => {
    getUserRecipes();
    console.log('userRecipeData has been updated:', userRecipeData);
  }, []);

  const [page, setPage] = useContext(TogglePageContext);
  return (
    <div className="user-recipes">
      <table className="card-table centered-table" border="1px solid black">
        <tbody>
        <tr  className="table-title" style={{ height: '20px'}}>
          <td style={{fontFamily: 'Pacifico, sans-serif', fontSize:'30px', textAlign: 'center' }}width="500px">Saved Recipes</td>
        </tr>
        <tr style={{ height: '2px' }}>
          <td width="500px">
            <hr style={{ padding: '0px', margin: '0px' }} />
          </td>
        </tr>
          {userRecipeData.map((oneRecipe, index) => (
            <React.Fragment key={index}>
              <tr style={{ height: '20px' }} onClick={() => {
                  clickHandler(oneRecipe.recipe_id, oneRecipe.recipe_name);
                  }}>
                <td width="500px">{oneRecipe.recipe_name}</td>
              </tr>
              <tr style={{ height: '2px' }}>
                <td width="500px">
                  <hr style={{ padding: '0px', margin: '0px' }} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserRecipes;