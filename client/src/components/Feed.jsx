import React, { useContext } from 'react';
import { TogglePageContext } from './App.jsx';

const Feed = () => {

  const [page, setPage] = useContext(TogglePageContext);

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

    </div>
  )
}

export default Feed;