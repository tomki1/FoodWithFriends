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
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');


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
        setMatchData(response.data);
      })
      .catch((error) => console.log('Error', error.message));


  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target.result;
      setSelectedImage(base64String);
    };
  reader.readAsDataURL(file);
  };

  const imageClickHandler = () => {
    console.log("in image click")
    if (selectedImage) {
      const currentUser = sessionStorage.getItem('username');
      const options = {
        method: 'PUT',
        url: '/matches/update',
        responseType: 'json',
        data: {
          recipeID,
          secondUser,
          currentUser,
          imageData: selectedImage
        }
      }
        axios(options)
        .then((response) => {
          setMatchData(response.data);
          setSelectedImage('');
        })
        .catch((error) => console.log('Error', error.message));

    }
  }

  const createMatch = () => {
    setIsLoading(true);
    const currentUser = sessionStorage.getItem('username');
    const options = {
      method: 'POST',
      url: '/matches/add',
      responseType: 'json',
      data: {
        recipeID,
        secondUser,
        currentUser,
        recipeName
      }
    }
      axios(options)
      .then((response) => {
        setMessage(response.data.message);
        setIsLoading(false);
      })
      .catch((error) => setMessage(error.message));
    }

  useEffect(() => {
    getMatchData();
    console.log('matchData has been updated:', matchData);
  }, []);

  useEffect(() => {
    console.log("message change")
  }, [matchData, message]);



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

      <h2>Match</h2>
      {message}
      <button onClick={() => {
        createMatch();

      }}>
        Create Match
      </button>

      {isLoading ? null :
      <>
         <table>
      <thead>
        <tr>
          <th style={headerCellStyle}>Recipe Name</th>
          <th style={headerCellStyle}>{matchData?.username_1}</th>
          <th style={headerCellStyle}>{matchData?.username_2}</th>
          <th style={headerCellStyle}>Likes for {matchData?.username_1}</th>
          <th style={headerCellStyle}>likes for {matchData?.username_2}</th>
        </tr>
        </thead>
        <tbody>
            <tr>
              <td style={cellStyle}>{recipeName}</td>
              <td style={cellStyle}>
                {matchData.imageData_1 ? <img src={matchData.imageData_1} alt="Recipe" /> : <p>nothing here yet</p>}
              </td>
              <td style={cellStyle}>
                {matchData.imageData_2 ? <img src={matchData.imageData_2} alt="Recipe" /> : <p>nothing here yet</p>}
              </td>
              <td style={cellStyle}>{matchData?.likes_1}</td>
              <td style={cellStyle}>{matchData?.likes_2}</td>
            </tr>
        </tbody>
      </table>

      <div>
      <input type="file" onChange={handleImageChange} />
      {selectedImage && <img src={selectedImage} alt={sessionStorage.getItem('username')} />}
      <button onClick={imageClickHandler}>Upload Image</button>
    </div>
      </>}

    </div>
  )
}

export default ViewMatch;