import React, { useState, useContext } from 'react';
import { RecipeResultsContext, TogglePageContext, RecipeIndexContext } from './App.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const RecipeEntry = ({ index }) => {

  const [recipeResults, setRecipeResults] = useContext(RecipeResultsContext);
  const [page, setPage] = useContext(TogglePageContext);
  const [recipeIndex, setRecipeIndex] = useContext(RecipeIndexContext);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => {
    setShow(true);
  }

  const scrollToTop = () => {
    window.scrollTo(0, 0);
}

  return (
    <div>
      <p onClick={handleShow} style={{ cursor: 'pointer' }}>
        {recipeResults[index]?.name}
      </p>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{recipeResults[index]?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src={recipeResults[index]?.thumbnail_url} alt={recipeResults[index]?.name} style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: "10px"}} />
          {recipeResults[index].description ? (
            <p>{recipeResults[index].description}</p>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-outline-secondary" size="sm" onClick={() => {
            setPage('recipe');
            setRecipeIndex(index);
            scrollToTop();
          }}>
            View Recipe
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default RecipeEntry;