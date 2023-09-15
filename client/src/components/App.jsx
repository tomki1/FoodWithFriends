import React, { useState, useEffect } from 'react';
import  RecipeSearch from './RecipeSearch.jsx';
import  Recipe from './Recipe.jsx';
import FriendList from './FriendList.jsx';
import CreateSessionName from './CreateSessionName.jsx';
import UserRecipes from './UserRecipes.jsx';
import Feed from './Feed.jsx';
import Match from './Match.jsx';
import Fight from './Fight.jsx';
import ViewMatch from './ViewMatch.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../scss/main.scss'; // Import your SCSS styles
import { Button } from 'react-bootstrap'


export const FoodQueryContext = React.createContext();
export const RecipeResultsContext = React.createContext();
export const TogglePageContext = React.createContext();
export const RecipeIndexContext = React.createContext();
export const RecipeIDContext = React.createContext();
export const SecondUserContext = React.createContext();
export const RecipeNameContext = React.createContext();


const App = () => {

  const [foodQuery, setFoodQuery] = useState('');
  const [recipeResults, setRecipeResults] = useState([]);
  const [page, setPage] = useState('createUsername');
  const [recipeIndex, setRecipeIndex] = useState(-1);
  const [recipeID, setRecipeID] = useState(-1);
  const [secondUser, setSecondUser] = useState(-1);
  const [recipeName, setRecipeName] = useState(-1);

  useEffect(() => {
    console.log('page has been updated:', page);
  }, [page]);

  useEffect(() => {
    if (sessionStorage.getItem('username') === null) {
      setPage('createUsername');
    }
  }, [page]);


  return (
    <div>
      <Button bsStyle='primary' bsSize='large'>hi</Button>
      <FoodQueryContext.Provider value={[
        foodQuery, setFoodQuery
      ]}>
      <RecipeResultsContext.Provider value={[
        recipeResults, setRecipeResults
      ]}>
      <TogglePageContext.Provider value={[
        page, setPage
      ]}>
      <RecipeIndexContext.Provider value={[
        recipeIndex, setRecipeIndex
      ]}>
      <RecipeIDContext.Provider value={[
        recipeID, setRecipeID
      ]}>
      <SecondUserContext.Provider value={[
        secondUser, setSecondUser
      ]}>
      <RecipeNameContext.Provider value={[
        recipeName, setRecipeName
      ]}>
        <h1>Food with Friends</h1>
        {page === 'viewMatch' ? <ViewMatch/> : null }
        {page === 'fight' ? <Fight/> : null }
        {page === 'match' ? <Match/> : null }
        {page === 'userRecipes' ? <UserRecipes/> : null }
        {page === 'feed' ? <Feed/> : null }
        {page === 'createUsername' ? <CreateSessionName/> : null }
        {page === 'home' ? <RecipeSearch/> : null }

        {page === 'recipe' ? <Recipe/> : null }
        {/* <FriendList/> */}
      </RecipeNameContext.Provider>
      </SecondUserContext.Provider>
      </RecipeIDContext.Provider>
      </RecipeIndexContext.Provider>
      </TogglePageContext.Provider>
      </RecipeResultsContext.Provider>
      </FoodQueryContext.Provider>
    </div>
  )
}

export default App;