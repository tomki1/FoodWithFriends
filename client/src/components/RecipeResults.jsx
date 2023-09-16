import React, { useContext, useEffect } from 'react';
import { RecipeResultsContext } from './App.jsx';
import RecipeEntry from './RecipeEntry.jsx';


const RecipeResults = () => {

  const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);


  useEffect(() => {
    // This function will run whenever recipeResults changes.
    console.log('recipeResults has been updated:', recipeResults);

    // You can perform any additional actions here based on the updated recipeResults.
  }, [recipeResults]);

  return (
    <div className="recipe-search-results">

      <table className="card-table centered-table" border="1px solid black">
        <tbody>
          <tr className="table-title" style={{ height: '20px'}}>
            <td style={{fontFamily: 'Pacifico, sans-serif', fontSize:'30px', textAlign: 'center' }}width="500px">Recipes</td>
          </tr>
          <tr style={{ height: '2px' }}>
            <td width="500px">
              <hr style={{ padding: '0px', margin: '0px' }} />
            </td>
          </tr>
        {recipeResults.length > 0
        ?
        recipeResults.map((recipe, index) => (
          <>
            <tr style={{ height: '20px' }}>
              <td width="500px">        <RecipeEntry key={index} index={index}/></td>
            </tr>
            <tr style={{ height: '2px' }}>
              <td width="500px">
                <hr style={{ padding: '0px', margin: '0px' }} />
              </td>
            </tr>
          </>
          ))
        : null}
        </tbody>
      </table>
    </div>
  )
}

export default RecipeResults;