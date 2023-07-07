/* This is the component that allows the user to change their name or email in the settings page. The component is only
* visible if the user is logged in and there is a userId that can be retrieved from the local storage. First the user's data
* is retrieved from the database, and the retrieved data is set as default values in the settings form  */
import {Button, Form, Message} from "semantic-ui-react";
import React, {Component} from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:9999/api';

class SettingsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            messageFromServer: '',
            updated: false,
            error: false,
            firstNameError: false,
            lastNameError: false,
            emailError: false
        };
    }

    async componentDidMount() {
        const userId = localStorage.getItem('userId');
        if (userId === null) {
            this.setState({
                error: true,
            });
        }
        try {
            const response = await axios.get(baseUrl + '/user/' + userId, {
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('jwtToken')
                }
            });
            // console.log(response.data);
            this.setState({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                confirmEmail: response.data.email,
                error: false
            });
        } catch (error) {
            console.log(error.response.data);
            this.setState({
                error: true
            });
        }
    }
    //trim whitespaces from email input and set to lowercase
    handleEmailChange = name => (event) => {
        this.setState({
            [name]: event.target.value.trim().toLowerCase(),
        });
    };

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };
    /*Function to update the user's personal information. The form is validated so that names can't be less than 2
    * characters and email must be a valid email. Also, user must confirm their email by writing it in the form twice (identically) */
    updateUser = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const {firstName, lastName, email, confirmEmail} = this.state;
        if (firstName.length < 2) {
            this.setState({
                firstNameError: true,
                messageFromServer: 'check input'
            });
        }
        if (lastName.length < 2) {
            this.setState({
                lastNameError: true,
                messageFromServer: 'check input'
            });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            this.setState({
                emailError: true,
                messageFromServer: 'check input'
            });
        }
        if (email !== confirmEmail) {
            this.setState({
                messageFromServer: 'emails are not a match',
            });
        } else {
            try {
                const response = await axios.get(
                    baseUrl + '/user', {
                        params: {
                            id: userId,
                            email: email
                        }
                    }
                );
                // console.log(response.data);
                if (response.data.message === 'email ok') {
                    try {
                        const response = await axios.put(
                            baseUrl + '/user/' + userId,
                            {
                                firstName,
                                lastName,
                                email
                            }, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    token: localStorage.getItem('jwtToken')
                                }
                            }
                        );
                        // console.log(response.data);
                        if (response.data.message === 'user updated') {
                            this.setState({
                                updated: true,
                                error: false,
                            });
                        } else {
                            this.setState({
                                updated: false,
                                error: true,
                                firstName: '',
                                lastName: '',
                                email: ''
                            });
                        }
                    } catch (error) {
                        console.log(error.response.data);
                    }
                }
            } catch (error) {
                console.log(error.response.data);
                this.setState({
                    updated: false,
                    emailError: true,
                    messageFromServer: 'email already in db'
                })
            }
        }
    };

    render() {
        const {
            firstName, lastName, email, error, updated, confirmEmail, messageFromServer, firstNameError,
            lastNameError, emailError
        } = this.state;

        if (error) {
            return (
                <div>
                    &nbsp;
                    <Message negative>
                        <Message.Header> Jotain meni vikaan! Kirjaudu sisään tai yritä myöhemmin
                            uudelleen. </Message.Header>
                    </Message>
                </div>
            );
        }
        return (
            <div style={{
                backgroundColor: 'white',
                paddingTop: '5px', paddingBottom: '20px', paddingLeft: '20px',
                paddingRight: '20px'
            }}>
                <div className='form-container'>
                    <h3>Käyttäjätiedot</h3>
                    <Form className="update-form" onSubmit={this.updateUser}>
                        <Form.Input
                            id="firstName"
                            label="Vaihda etunimi:"
                            onChange={this.handleChange('firstName')}
                            value={firstName}
                            type="text"
                            placeholder="Etunimi"
                            error={firstNameError}
                            icon='user'
                            iconPosition='left'
                        />
                        <Form.Input
                            id="lastName"
                            label="Vaihda sukunimi:"
                            onChange={this.handleChange('lastName')}
                            value={lastName}
                            type="text"
                            placeholder="Sukunimi"
                            error={lastNameError}
                            icon='user'
                            iconPosition='left'
                        />
                        <Form.Input
                            id="email"
                            label="Vaihda sähköpostiosoite:"
                            onChange={this.handleEmailChange('email')}
                            value={email}
                            type="email"
                            placeholder="Uusi sähköpostiosoite"
                            error={emailError}
                            icon='envelope'
                            iconPosition='left'
                        />
                        <Form.Input
                            id="confirmEmail"
                            label="Uusi sähköposti uudestaan:"
                            onChange={this.handleEmailChange('confirmEmail')}
                            value={confirmEmail}
                            type="email"
                            placeholder="Uusi sähköpostiosoite uudestaan"
                            icon='envelope'
                            iconPosition='left'
                            error={emailError}
                        />
                        <Button type='submit' primary>
                            Tallenna muutokset
                        </Button>
                    </Form>
                    &nbsp;
                </div>
                {updated && (
                    <Message positive>
                        <Message.Header>
                            Tietosi on nyt päivitetty!
                        </Message.Header>
                    </Message>
                )}
                {messageFromServer === 'emails are not a match' && (
                    <Message negative>
                        <Message.Header>Sähköpostiosoitteen vahvistaminen epäonnistui! Tarkista, että syötteet
                            ovat samat. </Message.Header>
                    </Message>
                )}
                {messageFromServer === 'check input' && (
                    <Message negative>
                        <Message.Header>Tarkista syötteet! </Message.Header>
                        <p>Kaikki kentät ovat pakollisia. Etu- ja sukunimen tulee olla vähintään 2 merkkiä
                            pitkät, ja sähköpostiosoitteen tulee olla muodossa esimerkki@esimerkki.esim </p>
                    </Message>
                )}
                {messageFromServer === 'email already in db' && (
                    <Message negative>
                        <Message.Header>Tarkista sähköpostiosoite!</Message.Header>
                        <p>Tämä sähköpostiosoite on jo käytössä jollain toisella tilillä.</p>
                    </Message>
                )}
            </div>
        );
    }
}

export default SettingsForm;
