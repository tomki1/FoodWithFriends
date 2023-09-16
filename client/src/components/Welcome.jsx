import React, { useContext } from 'react';
import { Context } from './App.jsx';
import { TogglePageContext } from './App.jsx';
import { Button } from 'react-bootstrap'
import Banner from '../../dist/images/welcome.jpg';



const Welcome = () => {

  const [page, setPage] = useContext(TogglePageContext);

  return (
    <div>
      <div className="image-container">
        <img className="welcome-banner" src={Banner} alt="welcome"/>
        <div class="text-overlay">
          <p>explore recipes.</p>
          <p>share photos.</p>
          <p>enjoy food.</p>
          <Button variant="outline-secondary" onClick={() => setPage('createUsername')}>Login</Button>
        </div>
      </div>
      <div style={{float: "right"}}>
        <a style={{color: "gray"}}href="https://www.freepik.com/free-vector/blank-junk-food-frame-background_14723648.htm#query=food%20sketch&position=5&from_view=search&track=ais">Image by rawpixel.com</a> on Freepik
      </div>
    </div>
  )
}

export default Welcome;