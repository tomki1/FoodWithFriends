import React, { useState, useEffect, useContext } from 'react';
import { TogglePageContext, RecipeIDContext, SecondUserContext, RecipeResultsContext, RecipeNameContext } from './App.jsx';
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

const ViewMatch = () => {


  const [page, setPage] = useContext(TogglePageContext);
  const [matchData, setMatchData] = useState({});
  const [recipeID, setRecipeID] = useContext(RecipeIDContext);
  const [secondUser, setSecondUser] = useContext(SecondUserContext);
  const [recipeName, setRecipeName] = useContext(RecipeNameContext);


  const getMatchData = () => {
    console.log('in client get match')
    const currentUser = sessionStorage.getItem('username');
    const options = {
      method: 'GET',
      url: '/matches/get',
      responseType: 'json',
      params: {
        recipeID,
        secondUser,
        currentUser,
        recipeName
      }
    }
      axios(options)
      .then((response) => {
        console.log("hi")
        setMatchData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.log('Error', error.message));


  }

  const imageHandler = () => {




  }

  useEffect(() => {
    getMatchData();
    console.log('matchData has been updated:', matchData);
  }, []);
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
      <h2>Ongoing Match</h2>

      <table>
      <thead>
        <tr>
          <th style={headerCellStyle}>Recipe Name</th>
          <th style={headerCellStyle}>Your Photo</th>
          <th style={headerCellStyle}>Friend's Photo</th>
        </tr>
        </thead>
        <tbody>
            <tr>
              <td style={cellStyle}>{matchData.recipe_name}</td>
              <td style={cellStyle}>{matchData.user_1_photo}</td>
              <td style={cellStyle}>{matchData.user_2_photo}</td>
            </tr>
        </tbody>
      </table>

      <div className="form-group">
      <p className="text-muted">Select a jpeg image of the collectible.</p>
      <input className="form-control-file" type="file" name="pic" id="image" accept="image/jpeg" required />
      <button className="btn btn-success" onClick={()=>{imageHandler();}}>Add</button>
    </div>
    </div>
  )
}

export default ViewMatch;