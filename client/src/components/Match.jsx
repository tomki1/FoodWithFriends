import React, { useState, useContext, useEffect } from 'react';
import { TogglePageContext, RecipeIDContext, SecondUserContext } from './App.jsx';
import axios from 'axios';

const cellStyle = {
  border: '1px solid black',
  padding: '5px',
};
const headerCellStyle = {
  border: '1px solid black',
  padding: '5px',
  fontWeight: 'bold',
};

const Match = () => {

  const [userMatches, setUserMatches] = useState([]);
  const [recipeID, setRecipeID] = useContext(RecipeIDContext);
  const [secondUser, setSecondUser] = useContext(SecondUserContext);

  const [page, setPage] = useContext(TogglePageContext);

  const getMatches = () => {
    const options = {
      method: 'GET',
      url: '/users/matches',
      responseType: 'json',
      params: {
        username: sessionStorage.getItem('username')
      }
    }
      axios(options)
      .then((response) => {
        console.log("response from db:", response.data);
        setUserMatches(response.data);
      })
      .catch((error) => console.log('Error', error.message));

  }

  useEffect(() => {
    getMatches();
    console.log('userMatches has been updated:', userMatches);
  }, []);


  const clickHandler = (recipe_id, second_user_id) => {
    setRecipeID(recipe_id);
    setSecondUser(second_user_id);
    setPage('fight');
  }
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
      <h2>Food Fight</h2>
      <table>
      <thead>
        <tr>
          <th style={headerCellStyle}>Friend</th>
          <th style={headerCellStyle}>Recipe</th>
          <th style={headerCellStyle}>Fight</th>
        </tr>
        </thead>
        <tbody>
          {userMatches.map((match, index) => (
            <tr key={index}>
              <td style={cellStyle}>{match.user2_username}</td>
              <td style={cellStyle}>{match.recipe_name}</td>
              <td style={cellStyle}>
                <button onClick={() => {
                  clickHandler(match.recipe_id, match.user2_username);
                  }}>
                  Fight
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Match;