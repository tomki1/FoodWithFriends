import React, { useState, useEffect } from 'react';
import  RecipeSearch from './RecipeSearch.jsx';
import  Recipe from './Recipe.jsx';
import FriendList from './FriendList.jsx';

export const FoodQueryContext = React.createContext();
export const RecipeResultsContext = React.createContext();
export const TogglePageContext = React.createContext();
export const RecipeIndexContext = React.createContext();


const App = () => {

  const [foodQuery, setFoodQuery] = useState('');
  const [recipeResults, setRecipeResults] = useState([]);
  const [page, setPage] = useState('home');
  const [recipeIndex, setRecipeIndex] = useState(-1);

  useEffect(() => {
    console.log('page has been updated:', page);
  }, [page]);

  return (
    <div>
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
        <h1>Food with Friends</h1>
        {page === 'home' ? <RecipeSearch/> : null }

        {page === 'recipe' ? <Recipe/> : null }
        {/* <FriendList/> */}
      </RecipeIndexContext.Provider>
      </TogglePageContext.Provider>
      </RecipeResultsContext.Provider>
      </FoodQueryContext.Provider>
    </div>
  )
}

export default App;