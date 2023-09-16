import React, { useState, useEffect, useContext } from 'react';
import { FoodQueryContext, RecipeResultsContext, TogglePageContext } from './App.jsx';
import axios from 'axios';
import RecipeResults from './RecipeResults.jsx';
import TypeDropdown from './TypeDropdown.jsx';
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';

export const TagTypeContext = React.createContext();
export const SelectedTypeContext = React.createContext();
export const SelectedTagContext = React.createContext();
const RecipeSearch = () => {

 const [foodQuery, setFoodQuery] = useContext(FoodQueryContext);
 const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);
 const [page, setPage] = useContext(TogglePageContext);

 const [tagTypes, setTagTypes] = useState([]);
 const [selectedType, setSelectedType] = useState(-1);
 const [selectedTag, setSelectedTag] = useState('');
 const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
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
        setIsLoading(false);
      }
    })
    .catch((error) => console.log('Error', error.message));
  }

    useEffect(() => {
      if (Object.keys(tagTypes).length === 0) {
        getTypes();
      }
    }, [tagTypes, isLoading]);

  return (
    <div className="search">
      <Form>
        <input type='text' style={{marginBottom: "10px", marginRight: "10px"}} onChange={(e) => setFoodQuery(e.target.value)}></input>
        <Button variant="outline-secondary" size="sm" onClick={() => getRecipes(foodQuery)}>Search Recipes</Button>
      </Form>
      <TagTypeContext.Provider value={[
        tagTypes, setTagTypes
      ]}>
      <SelectedTypeContext.Provider value={[
        selectedType, setSelectedType
      ]}>
      <SelectedTagContext.Provider value={[
        selectedTag, setSelectedTag
      ]}>
        {isLoading === false ? <TypeDropdown/> : null}

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