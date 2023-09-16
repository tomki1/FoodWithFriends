import React, { useState, useEffect, useContext } from 'react';
import { TogglePageContext, RecipeIDContext, RecipeNameContext } from './App.jsx';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Feed = () => {

  const [page, setPage] = useContext(TogglePageContext);
  const [matchFeed, setMatchFeed] = useState([]);
  const [recipeID, setRecipeID] = useContext(RecipeIDContext);
  const [recipeName, setRecipeName] = useContext(RecipeNameContext);

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

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  const handleLikeClick = (matchID, userLiked, userNotLiked, likeCol) => {
    const options = {
      method: 'PUT',
      url: '/matches/likes',
      responseType: 'json',
      data: {
        matchID,
        userLiked,
        userNotLiked,
        likeCol
      }
    }
      axios(options)
      .then((response) => {
        setMatchFeed(response.data);
      })
      .catch((error) => console.log('Error', error.message));

  }

  const clickHandler = (recipe_id, recipe_name) => {
    setRecipeID(recipe_id);
    setRecipeName(recipe_name);
    setPage('savedFeedRecipe');
    scrollToTop();
  }

  useEffect(() => {
    getFeedData();
    console.log('matchFeed has been updated:', matchFeed);
  }, []);

  useEffect(() => {
    console.log('matchFeed has been updated:', matchFeed);
  }, [matchFeed]);

  return (
    <div className="feed">
      <div className="card-container">
        {matchFeed.length > 0 &&
          matchFeed.map((feedItem, index) => (
            <div key={index} className="horizontal-card">
                <Card style={{ width: '18rem' }}>
                  <Card.Header className="card-header-1" as="h5">
                    {feedItem.recipe_name}
                  </Card.Header>
                  { feedItem.user_1_photo ?
                    <Card.Img className="image-card" variant="top" src={feedItem.user_1_photo} alt="Recipe" />
                  : <p>no image uploaded</p>
                  }
                  <Card.Body>
                    <Card.Title>{feedItem.username_1}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{feedItem.likes_1} likes</Card.Subtitle>
                    <div className="card-button-container">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          handleLikeClick(feedItem.id, feedItem.username_1, feedItem.username_2, feedItem.likes_1);
                        }}>
                        like
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          clickHandler(feedItem.recipe_id, feedItem.recipe_name);
                        }}>
                        view recipe
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                  <Card.Header className="card-header-2" as="h5">
                    {feedItem.recipe_name}
                  </Card.Header>
                  { feedItem.user_1_photo ?
                    <Card.Img className="image-card" variant="top" src={feedItem.user_2_photo} alt="Recipe" />
                  : <p>no image uploaded</p>
                  }
                  <Card.Body>
                    <Card.Title>{feedItem.username_2}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{feedItem.likes_2} likes</Card.Subtitle>
                    <div className="card-button-container">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          handleLikeClick(feedItem.id, feedItem.username_2, feedItem.username_1, feedItem.likes_2);
                        }}>
                        like
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          clickHandler(feedItem.recipe_id, feedItem.recipe_name);
                        }}>
                        view recipe
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Feed;