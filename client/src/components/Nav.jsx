import React, { useState, useEffect, useContext } from 'react';
import { TogglePageContext } from './App.jsx';
import Nav from 'react-bootstrap/Nav';

function NavBar() {

  const [page, setPage] = useContext(TogglePageContext);
  return (
    <Nav justify variant="tabs" defaultActiveKey="/home">
      <Nav.Item className="link-1" >
        <Nav.Link eventKey="link-1" onClick={()=>setPage('home')}>Search</Nav.Link>
      </Nav.Item>
      <Nav.Item className="link-2" >
        <Nav.Link eventKey="link-2" onClick={()=>setPage('userRecipes')}>Saved Recipes</Nav.Link>
      </Nav.Item>
      <Nav.Item className="link-3" >
        <Nav.Link eventKey="link-3" onClick={()=>setPage('feed')}>Food Feed</Nav.Link>
      </Nav.Item>
      <Nav.Item className="link-4">
        <Nav.Link eventKey="link-4" onClick={()=>setPage('match')}>Challenge</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default NavBar;