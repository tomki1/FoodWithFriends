import React, { useState } from 'react';
import  RecipeSearch from './RecipeSearch.jsx';
import FriendList from './FriendList.jsx';

export const Context = React.createContext();

const App = () => {

  const [foodQuery, setFoodQuery] = useState('');


  return (
    <div>
      <Context.Provider value={[foodQuery, setFoodQuery]}>
        <h1>Food with Friends</h1>
        <RecipeSearch/>
        <FriendList/>
      </Context.Provider>
    </div>
  )
  }

export default App;