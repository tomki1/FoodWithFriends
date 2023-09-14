import React, { useState, useEffect, useContext } from 'react';
import { TogglePageContext } from './App.jsx';
import axios from 'axios';

const Feed = () => {

  const cellStyle = {
    border: '1px solid black',
    padding: '5px',
  };
  const headerCellStyle = {
    border: '1px solid black',
    padding: '5px',
    fontWeight: 'bold',
  };


  const [page, setPage] = useContext(TogglePageContext);
  const [matchFeed, setMatchFeed] = useState([]);

  const getFeedData = () => {
    const options = {
      method: 'GET',
      url: '/matches/all',
      responseType: 'json',
    }
      axios(options)
      .then((response) => {
        setMatchFeed(response.data);
      })
      .catch((error) => console.log('Error', error.message));


  }

  useEffect(() => {
    getFeedData();
    console.log('matchFeed has been updated:', matchFeed);
  }, []);

  return (
    <div>
      <button onClick={() => {
        setPage('home');
      }}>
        Search
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
      <h2>Food Feed</h2>

      <table>
      <thead>
        <tr>
        <th style={headerCellStyle}>Recipe Name</th>
        <th style={headerCellStyle}>Friend 1</th>
        <th style={headerCellStyle}>Friend 2</th>
        <th style={headerCellStyle}>Food Image 1</th>
        <th style={headerCellStyle}>Food Image 2</th>
        <th style={headerCellStyle}>Likes 1</th>
        <th style={headerCellStyle}>Likes 2</th>
        </tr>
        </thead>
        <tbody>
          {matchFeed.length > 0 && matchFeed.map((feedItem, index) => (
            <tr key={index}>
              <td style={cellStyle}>{feedItem.recipe_name}</td>
              <td style={cellStyle}>{feedItem.username_1}</td>
              <td style={cellStyle}>{feedItem.username_2}</td>
              <td style={cellStyle}>
                <img src={feedItem.user_1_photo} alt="Recipe" />
              </td>
              <td style={cellStyle}>
                <img src={feedItem.user_2_photo} alt="Recipe" />
              </td>
              <td style={cellStyle}>{feedItem.likes_1}</td>
              <td style={cellStyle}>{feedItem.likes_2}</td>
            </tr>
          ))}
        </tbody>
      </table>



    </div>
  )
}

export default Feed;