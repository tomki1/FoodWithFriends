import React, { useState, useContext } from 'react';
import { TogglePageContext } from './App.jsx';
import axios from 'axios';

const CreateSessionName = () => {

  const [page, setPage] = useContext(TogglePageContext);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');


  const handleClick = () => {
    if (username === '') {
      setError('Please enter username')
    } else {
    sessionStorage.setItem('username', username);
    const options = {
      method: 'POST',
      url: '/users/add',
      responseType: 'json',
      body: {
        username: username
      }
    }
    axios(options)
    .then((response) => {
      setPage('userRecipes');
    })
    .catch((error) => console.log('Error', error.message));
    }
  }

  return (
    <div>
      <h1>Choose Username</h1>
      {error !== '' ? error : null}
      <br></br>
      username: <input name="name" onChange={(e)=>(setUsername(e.target.value))}/>
      <br></br>
      <button className="submitUsername" onClick={()=>{handleClick();}}>submit</button>
    </div>
  )
}

export default CreateSessionName;