// This component handles the rendering of login page,
// its connection to backend, and redirecting to homepage in case user is already logged in.

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Message
} from 'semantic-ui-react';
import validate from '../validation/LoginPageValidationRules';

import { AuthContext } from '../context/auth';
import axios from 'axios';
const baseUrl = 'http://localhost:9999/api';

function Login(props) {
  const context = useContext(AuthContext);

  //Check if user is already logged in. If so, push user to homepage.
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    props.history.push('/home');
  }

  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      loginUser();
    }
  }, [errors]);

  const onSubmit = event => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  const onEmailChange = event => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value.trim().toLowerCase()
    }));
  };
  const onPasswordChange = event => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  function loginUser() {
    axios
      .post(baseUrl + '/users/login', values)
      .then(response => {
        if (response.status === 200) {
          //If you want to add some information to frontend from the back, you can set items to localStorage.
          // These have to be provided from the back first:
          const token = response.data.token;
          const id = response.data.id;
          const username = response.data.username;
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('userId', id);
          localStorage.setItem('username', username);
          context.login(response.data);
          props.history.push('/home');
        }
      })

      .catch(error => {
        console.log('catch' + error);
        setErrors(error.response.data);
      });
  }

  return (
    <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='blue' textAlign='center'>
          Kirjaudu
        </Header>
        <Form size='large' onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              //label='Sähköposti'
              placeholder='Sähköpostiosoite'
              name='email'
              type='text'
              value={values.email}
              error={errors.email ? true : false}
              onChange={onEmailChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              //label='Salasana'
              placeholder='Salasana'
              type='password'
              name='password'
              value={values.password}
              error={errors.password ? true : false}
              onChange={onPasswordChange}
            />
            <Button color='blue' fluid size='large'>
              Kirjaudu
            </Button>
          </Segment>
        </Form>
        {Object.keys(errors).length > 0 && (
          <div className='ui error message'>
            <ul className='list'>
              {Object.values(errors).map(value => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
        <Message>
          <a href='/forgot'>Unohtuiko salasana?</a>
          <br />
          {/*Ei vielä tunnuksia? <a href='/signup'>Rekisteröidy</a>*/}
          Ei vielä tunnuksia? <a href='/contact'> Ota yhteyttä ylläpitäjään.</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
