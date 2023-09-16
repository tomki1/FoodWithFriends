import React, { useState, useContext } from 'react';
import { TogglePageContext } from './App.jsx';
import axios from 'axios';
import { Button } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

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
      data: {
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
    <div class="d-flex justify-content-center">

      <Form>
      {error !== '' ? <Alert variant="warning">
       {error}
        </Alert> : null}
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <h1>log in</h1>
          <Form.Label>username:</Form.Label>
          <Form.Control type="text" style={{ maxWidth: '300px' }} placeholder="enter username" onChange={(e)=>(setUsername(e.target.value))}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>password:</Form.Label>
          <Form.Control type="password" style={{ maxWidth: '300px' }} placeholder="Password" />
        </Form.Group>
        <Button variant="secondary" size="sm" onClick={()=>{handleClick();}}>
          submit
      </Button>
      </Form>
      <br></br>

    </div>
  )
}

export default CreateSessionName;