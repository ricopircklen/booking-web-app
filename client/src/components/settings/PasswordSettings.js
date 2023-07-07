/* This component allows the user to change their password while logged in. The page will not be visible unless the user is logged
* in, i.e. there is a userId that can be retrieved from the Local Storage */
import {Button, Form, Message} from "semantic-ui-react";
import React, {Component} from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:9999/api';

class PasswordSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            messageFromServer: '',
            updated: false,
            error: false,
            passwordError: false
        };
    }
    async componentDidMount() {
        //checking if user is logged in
        const userId = localStorage.getItem('userId');
        if (userId === null) {
            this.setState({
                error: true,
            });
        }
        //retrieve user's info from the database
        try {
            const response = await axios.get(baseUrl + '/user/' + userId, {
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('jwtToken')
                }
            });
            // console.log(response.data);
            this.setState({
                email: response.data.email,
                updated: false,
                error: false,
            });
        } catch (error) {
            console.log(error.response.data);
            this.setState({
                updated: false,
                error: true
            });
        }
    }

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };
    /* Function to update the user's password: first we validate the inputs so that the new password is at least 8 characters and
    confirmPassword field matches with the new password. If both validation checks are cleared the program calls for backend
     api put (update) method. If not, the user sees an error message.*/
    updatePassword = async (e) => {
        e.preventDefault();
        const {email, password, confirmPassword} = this.state;
        if (password.length < 8){
            this.setState({
                passwordError: true,
                messageFromServer: 'password is too short'
            })
        }
        if (password !== confirmPassword) {
            this.setState({
                messageFromServer: 'passwords are not a match',
                password: '',
                confirmPassword: ''
            });
        } else {
            try {
                const response = await axios.put(
                    baseUrl + '/updatePassword',
                    {email,
                        password},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            token: localStorage.getItem('jwtToken')
                        }
                    });
                //if the response from backend is positive, state of 'updated' is set as true
                // console.log(response.data);
                if (response.data.message === 'password updated') {
                    this.setState({
                        updated: true,
                        error: false,
                        password: '',
                        confirmPassword: ''
                    });
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
            password, error, updated, confirmPassword, messageFromServer, passwordError
        } = this.state;

        if (error) {
            return (
                <div>
                    &nbsp;
                    <Message negative>
                        <Message.Header>Jotain meni vikaan! Kirjaudu sisään tai yritä myöhemmin uudelleen.</Message.Header>
                    </Message>
                </div>
            );
        }
        return (
            <div style={{backgroundColor: 'white',
                paddingTop: '5px', paddingBottom: '20px', paddingLeft: '20px',
                paddingRight: '20px'}}>
                <div className='form-container'>
                    <h3>Vaihda salasana</h3>
                    <Form className="password-form" onSubmit={this.updatePassword}>
                        <Form.Input
                            id="password"
                            label="Syötä uusi salasana:"
                            onChange={this.handleChange('password')}
                            value={password}
                            type="password"
                            placeholder="Uusi salasana"
                            error={passwordError}
                            icon='lock'
                            iconPosition='left'
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
                            Salasanasi on päivitetty!
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

export default PasswordSettings;