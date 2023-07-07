/* This is the page where user can reset their password that they've forgotten. This page is only available via valid email link.
* The link url must have a valid token that can be found in the database. The link also cannot be expired; once the user has
* ordered a password reset link to their email, they have one hour to use it */
import {Button, Form, Message} from "semantic-ui-react";
import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

const baseUrl = 'http://localhost:9999/api';

class ResetPassword extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            messageFromServer: '',
            updated: false,
            error: false,
            passwordError: false,
            redirect: false
        };
    }

    async componentDidMount() {
        const {
            match: {
                params: {token},
            },
        } = this.props;
        //checking if the link is valid i.e. the token exists in the database
        try {
            const response = await axios.get(baseUrl + '/reset', {
                params: {
                    resetPasswordToken: token,
                },
            });
            // console.log(response.data);
            if (response.data.message === 'password reset link ok') {
                this.setState({
                    email: response.data.email,
                    updated: false,
                    error: false,
                });
            }
        } catch (error) {
            console.log(error.response.data);
            this.setState({
                updated: false,
                error: true,
            });
        }
    }

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };
    /* Function to update the user's password. Form validations: password must be at least 8 characters and password + confirmPassword
    * must match. */
    updatePassword = async (e) => {
        e.preventDefault();
        const {email, password, confirmPassword} = this.state;
        const {
            match: {
                params: {token},
            },
        } = this.props;
        if (password !== confirmPassword) {
            this.setState({
                messageFromServer: 'passwords are not a match',
                password: '',
                confirmPassword: ''
            });
        }
        if (password.length < 8){
                this.setState({
                    passwordError: true,
                    messageFromServer: 'password is too short',
                    password: '',
                    confirmPassword: ''
                });
        } else {
            //if validations pass, call for backend put (update) function to update the user's password
            try {
                const response = await axios.put(
                    baseUrl + '/updateForgottenPassword',
                    {
                        email,
                        password,
                        resetPasswordToken: token,
                    },
                );
                // console.log(response.data);
                if (response.data.message === 'password updated') {
                    this.setState({
                        updated: true,
                        error: false,
                        password: '',
                        confirmPassword: ''
                    });
                    //if update is successful, set redirect to happen 2 seconds later
                    setTimeout(() => {
                        this.setState({
                            redirect: true
                        })
                    }, 2000);
                } else {
                    this.setState({
                        updated: false,
                        error: true,
                        password: '',
                        confirmPassword: ''
                    });
                }
            } catch (error) {
                console.log(error.response.data);
            }
        }
    };

    render() {
        const {
            password, error, updated, confirmPassword, messageFromServer, passwordError, redirect
        } = this.state;

        if (error) {
            return (
                <div>
                    &nbsp;
                    <Message negative>
                        <Message.Header>Salasanan vaihtaminen ei onnistu!</Message.Header>
                        <p>Linkki oli virheellinen tai vanhentunut. Tilaa uusi linkki.</p>
                    </Message>
                </div>
            );
        }
        //after updating the user's password redirect the user to login page
        if (redirect) {
            return (
                <Redirect to={'/login'} />
            )
        }
        return (
            <div style={{backgroundColor: 'white',
                paddingTop: '5px', paddingBottom: '20px', paddingLeft: '20px',
                paddingRight: '20px'}}>
                <div className='form-container'>
                    <h1>Vaihda salasana</h1>
                    <Form className="password-form" onSubmit={this.updatePassword}>
                        <Form.Input
                            id="password"
                            label="Syötä uusi salasana:"
                            onChange={this.handleChange('password')}
                            value={password}
                            type="password"
                            placeholder="Uusi salasana"
                            icon='lock'
                            iconPosition='left'
                            error={passwordError}
                        />
                        <Form.Input
                            id="confirmPassword"
                            label="Vahvista uusi salasana:"
                            value={confirmPassword}
                            type="password"
                            placeholder="Uusi salasana uudelleen"
                            onChange={this.handleChange('confirmPassword')}
                            icon='lock'
                            iconPosition='left'
                        />
                        <Button type='submit' primary>
                            Päivitä salasana
                        </Button>
                    </Form>
                    &nbsp;
                </div>
                {updated && (
                    <Message positive>
                        <Message.Header>
                            Salasanasi on päivitetty! Kirjaudu sisään sähköpostiosoitteellasi ja uudella
                            salasanallasi.
                        </Message.Header>
                    </Message>
                )}
                {messageFromServer === 'passwords are not a match' && (
                    <Message negative>
                        <Message.Header>Salasanan vahvistaminen epäonnistui. Syötä uusi salasana
                            uudestaan.</Message.Header>
                    </Message>
                )}
                {messageFromServer === 'password is too short' && (
                    <Message negative>
                        <Message.Header>Salasanan tulee olla vähintään 8 merkkiä pitkä!</Message.Header>
                    </Message>
                )}
            </div>
        );
    }
}

export default ResetPassword;