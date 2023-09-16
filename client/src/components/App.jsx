import React, { useState, useEffect } from 'react';
import  RecipeSearch from './RecipeSearch.jsx';
import  Recipe from './Recipe.jsx';
import Welcome from './Welcome.jsx';
import CreateSessionName from './CreateSessionName.jsx';
import UserRecipes from './UserRecipes.jsx';
import Feed from './Feed.jsx';
import Match from './Match.jsx';
import Fight from './Fight.jsx';
import ViewMatch from './ViewMatch.jsx';
import SavedFeedRecipe from './SavedFeedRecipe.jsx';
import NavBar from './Nav.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Container from 'react-bootstrap/Container';


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
  const [page, setPage] = useState('feed');
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
      <h1 class="logo-text" onClick={()=>setPage('welcome')}>RecipeCards.</h1>
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
        <NavBar/>
        {page === 'viewMatch' ? <ViewMatch/> : null }
        {page === 'fight' ? <Fight/> : null }
        {page === 'match' ? <Match/> : null }
        {page === 'userRecipes' ? <UserRecipes/> : null }
        {page === 'feed' ? <Feed/> : null }
        {page === 'createUsername' ? <CreateSessionName/> : null }
        {page === 'home' ? <RecipeSearch/> : null}
        {page === 'recipe' ? <Recipe/> : null }
        {page === 'welcome' ? <Welcome/> : null }
        {page === 'savedFeedRecipe' ? <SavedFeedRecipe/> : null }
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