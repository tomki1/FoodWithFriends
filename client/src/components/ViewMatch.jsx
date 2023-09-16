import React, { useState, useEffect, useContext } from 'react';
import { TogglePageContext, RecipeIDContext, SecondUserContext, RecipeResultsContext, RecipeNameContext } from './App.jsx';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

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
      <h2>{recipeName}</h2>
      <div>
      {message !== '' ? <Alert variant="warning">
       {message}
        </Alert> : null}
      </div>
      <Button variant="outline-success" onClick={() => createMatch()}>Create Match</Button>
      {isLoading ? null : (
        <div className="card-container">
          <div className="horizontal-card">
            <Card style={{ width: '18rem' }}>
              <Card.Header className="card-header-1" as="h5">
                {matchData.username_1}
              </Card.Header>
              {matchData.imageData_1 ? (
                <Card.Img variant="top" src={matchData.imageData_1} alt="Recipe" />
              ) : (
                <p>user hasn't uploaded an image</p>
              )}
              <Card.Body>
                <Card.Title>{matchData.likes_1} likes</Card.Title>
              </Card.Body>
            </Card>
          </div>
          <div className="horizontal-card">
            <Card style={{ width: '18rem' }}>
              <Card.Header className="card-header-2" as="h5">
                {matchData.username_2}
              </Card.Header>
              {matchData.imageData_2 ? (
                <Card.Img variant="top" src={matchData.imageData_2} alt="Recipe" />
              ) : (
                <p>user hasn't uploaded an image</p>
              )}
              <Card.Body>
                <Card.Title>{matchData.likes_2} likes</Card.Title>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
      <div>
        <input type="file" onChange={handleImageChange} />
        {selectedImage && <img src={selectedImage} alt={sessionStorage.getItem('username')} />}
        <Button variant="outline-success" size="sm" onClick={imageClickHandler}>
          Upload Photo
        </Button>
      </div>
    </div>
  )
}

export default ViewMatch;