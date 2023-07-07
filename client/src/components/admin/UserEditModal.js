/* Pop-up modal, that is responsible for updating user information in the admin panel. User's first name
* last name and email are text type inputs, admin status is a toggle button (admin-not admin)*/
import React, {useState} from 'react';
import {adminUpdateUser} from "../../service/ClientService";
import {Button, Form, Icon, Modal} from "semantic-ui-react";
import Notification from "../Notification";
import validate from '../../validation/UserEditModalValidation';

function UserEditModal(props) {
    const [user] = useState(props.user);
    const [firstName, setFirstName] = useState(props.user.firstName);
    const [lastName, setLastName] = useState(props.user.lastName);
    const [email, setEmail] = useState(props.user.email);
    const [isAdmin, setIsAdmin] = useState(props.user.isAdmin);
    const [message, setMessage] = useState(null);


    const handleFirstNameChange = (e, {value}) => setFirstName(value);
    const handleLastNameChange = (e, {value}) => setLastName(value);
    const handleEmailChange = (e, {value}) => setEmail(value);
    const handleIsAdminChange = () => setIsAdmin(!isAdmin);

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            isAdmin: isAdmin
        };
        try {
            if (validate(data)) {
                adminUpdateUser(user.id, data)
                    .then(props.update);
                setMessage('Käyttäjän muokkaus onnistui!');
            } else {
                setMessage('Käyttäjän muokkaus ei onnistunut');
            }
        } catch (e) {
            if (e.message === 'first name was not set') {
                setMessage('Etunimi on pakollinen!');
            } else if (e.message === 'first name must be at least 2 characters') {
                setMessage('Liian lyhyt etunimi!');
            } else if (e.message === 'last name was not set') {
                setMessage('Sukunimi on pakollinen!');
            } else if (e.message === 'last name must be at least 2 characters') {
                setMessage('Liian lyhyt sukunimi!');
            } else if (e.message === 'email was not set') {
                setMessage('Sähköpostiosoite on pakollinen!');
            } else if (e.message === 'email is not valid') {
                setMessage('Sähköpostiosoite on virheellinen!');
            } else {
                setMessage('Tuntematon virhe');
            }
        }
    };

    return(
        <Modal trigger={<Button primary basic icon><Icon className='edit'/></Button>} closeIcon>
            <Modal.Header style={{'borderBottomColor': '#0e6eb8', 'borderWidth': '4px'}}>Muokkaa käyttäjää</Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit}>
                    <Form.Input fluid label='Käyttäjän etunimi' placeholder='Etunimi' onChange={handleFirstNameChange} value={firstName}/>
                    <Form.Input fluid label='Käyttäjän sukunimi' placeholder='Sukunimi' onChange={handleLastNameChange} value={lastName}/>
                    <Form.Radio checked={isAdmin} onChange={handleIsAdminChange} label='Käyttäjä on admin' toggle/>
                    <Form.Input fluid label='Käyttäjän sähköposti' placeholder='Sähköposti' onChange={handleEmailChange} value={email}/>
                    <Form.Button primary>Vahvista muutos</Form.Button>
                    {message &&
                    <Notification message={message}/>
                    }
                </Form>
            </Modal.Content>
        </Modal>
    )
}

export default UserEditModal;