import React, { useState, useContext, useEffect } from 'react';
import { TogglePageContext, RecipeIDContext, SecondUserContext, RecipeNameContext } from './App.jsx';
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
  const [recipeName, setRecipeName] = useContext(RecipeNameContext);

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


  const clickHandler = (recipe_id, second_user_id, recipe_name) => {
    setRecipeID(recipe_id);
    setSecondUser(second_user_id);
    setRecipeName(recipe_name);
    setPage('fight');
  }
  return (
    <div className="match">
      <table className="card-table centered-table" border="1px solid black">
        <tbody>
          <tr style={{ height: '20px' }}>
            <td style={{ fontFamily: 'Pacifico, sans-serif', fontSize:'30px', textAlign: 'center' }} colSpan={2}>Challenge</td>
          </tr>
          <tr style={{ height: '2px' }}>
              <td colSpan={2}>
                <hr style={{ padding: '0px', margin: '0px' }} />
              </td>
            </tr>
          {userMatches.map((match, index) => (
            <React.Fragment key={index}>
              <tr style={{ height: '20px' }} onClick={() => {
                  clickHandler(match.recipe_id, match.user2_username, match.recipe_name);
                  }}>
                <td width="100px" style={{paddingLeft: '20px'}}>{match.user2_username}</td>
                <td width="500px" style={{textAlign: 'right', paddingRight: '20px'}}>{match.recipe_name}</td>
              </tr>
              <tr style={{ height: '2px' }}>
                <td colSpan={2}>
                  <hr style={{ padding: '0px', margin: '0px', width: '100%' }} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Match;