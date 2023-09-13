import React, { useState, useEffect, useContext } from 'react';
import { FoodQueryContext, RecipeResultsContext } from './App.jsx';
import axios from 'axios';
import RecipeResults from './RecipeResults.jsx';
import TypeDropdown from './TypeDropdown.jsx';

export const TagTypeContext = React.createContext();
export const SelectedTypeContext = React.createContext();
export const SelectedTagContext = React.createContext();
const RecipeSearch = () => {

 const [foodQuery, setFoodQuery] = useContext(FoodQueryContext);
 const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);

 const [tagTypes, setTagTypes] = useState([]);
 const [selectedType, setSelectedType] = useState(0);
 const [selectedTag, setSelectedTag] = useState('');

 useEffect(() => {
  console.log('recipeResults has been updated:', recipeResults);
}, [recipeResults]);

 const getRecipes = (foodName) => {
    const options = {
      method: 'GET',
      url: '/recipes',
      responseType: 'json',
      params: {
        foodName,
        selectedTag
      }
    }
      axios(options)
      .then((response) => {
        setRecipeResults(response.data.results);
      })
      .catch((error) => console.log('Error', error.message));
    }
const getTypes = () => {
    const options = {
      method: 'GET',
      url: '/tags/types',
      responseType: 'json',
    }
      axios(options)
      .then((response) => {
        const mappedTypes = response.data.results.reduce((result, item) => {
          const { type, name, display_name } = item;
          if (!result[type]) {
            result[type] = [];
          }
          result[type].push({name, display_name});
          return result;
        }, {});

        if (Object.keys(mappedTypes).length === 0) {
          getTypes();
        } else {
          setTagTypes(mappedTypes);
        }
      })
      .catch((error) => console.log('Error', error.message));
    }

    useEffect(() => {
      if (Object.keys(tagTypes).length === 0) {
        getTypes();
      }
    }, [tagTypes]);

  return (
    <div>
      <h2>Search for Recipe</h2>
      <input type='text' onChange={(e) => setFoodQuery(e.target.value)}></input>
      <button onClick={() => getRecipes(foodQuery)}>Search Recipes</button>

      <TagTypeContext.Provider value={[
        tagTypes, setTagTypes
      ]}>
      <SelectedTypeContext.Provider value={[
        selectedType, setSelectedType
      ]}>
      <SelectedTagContext.Provider value={[
        selectedTag, setSelectedTag
      ]}>
        <TypeDropdown/>
      </SelectedTagContext.Provider>
      </SelectedTypeContext.Provider>
      </TagTypeContext.Provider>

      {recipeResults.length > 0
      ? <RecipeResults/>
      : null
    }

    </div>
  )
}

export default RecipeSearch;