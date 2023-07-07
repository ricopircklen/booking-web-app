/*On this page the user can enter their email address in a form and receive an email link that allows them to change
* their password if they have forgotten it */
import {Button, Form, Message} from "semantic-ui-react";
import React, {Component} from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:9999/api';

class ForgotPassword extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            showError: false,
            messageFromServer: '',
            emailError: false
        };
    }
    //trim white spaces from input and set to lowercase
    formatInput = name => (event) => {
        this.setState({ [name]: event.target.value.trim() });
    };

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value.toLowerCase(),
        });
    };
    //Form validation: email must be a valid email address
    sendEmail = async (e) => {
        e.preventDefault();
        const {email} = this.state;
        if (!/\S+@\S+\.\S+/.test(email)) {
            this.setState({
                emailError: true,
                messageFromServer: 'check input'
            });
        } else {
            //if email is valid, call for backend post function that sends the email
            try {
                const response = await axios.post(
                    baseUrl + '/forgot',
                    {
                        email,
                    },
                );
                // console.log(response.data);
                if (response.data === 'recovery email sent') {
                    this.setState({
                        showError: false,
                        messageFromServer: 'recovery email sent'
                    });
                }
            } catch (error) {
                console.error(error.response.data);
                //if email is not in database i.e. there is no user with the given email, shows error message
                if (error.response.data === 'email not in db') {
                    this.setState({
                        showError: true,
                        messageFromServer: ''
                    });
                }
            }
        }
    };

    render() {
        const {
            email, messageFromServer, showError, emailError
        } = this.state;
        return (
            <div className='form-container' style={{
                backgroundColor: 'white',
                paddingTop: '5px', paddingBottom: '20px', paddingLeft: '20px',
                paddingRight: '20px'
            }}>
                <h2>Palauta salasana</h2>
                <Form onSubmit={this.sendEmail}>
                    <Form.Input
                        id="email"
                        label="Anna sähköpostiosoitteesi:"
                        value={email}
                        onChange={this.handleChange('email')}
                        placeholder="Sähköpostiosoite"
                        error={emailError}
                        onBlur={this.formatInput('email')}
                    />
                    <Button type='submit' primary>
                        Lähetä salasanan palautusviesti
                    </Button>
                </Form>
                &nbsp;
                <div>
                    {messageFromServer === 'check input' && (
                        <Message negative>
                            <Message.Header>Syötä sähköpostiosoiteesi!</Message.Header>
                        </Message>
                    )}
                    {showError && (
                        <Message negative>
                            <Message.Header>
                                Sähköpostiosoitteella ei löytynyt käyttäjätiliä! Tarkista sähköpostiosoite tai
                                rekisteröidy käyttäjäksi.
                            </Message.Header>
                        </Message>
                    )}
                    {messageFromServer === 'recovery email sent' && (
                        <Message positive>
                            <Message.Header>Sinulle on lähetetty sähköpostiviesti salasanan
                                vaihtamiseksi.</Message.Header>
                        </Message>
                    )}
                </div>
            </div>
        );
    }
}

export default ForgotPassword;