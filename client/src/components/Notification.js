import React from 'react'
import { Message } from 'semantic-ui-react'

const Notification = ({ message }) => {
    return message === "Varaus onnistui" || message === "Huoneen muokkaus onnistui!"
    || message === "Huoneen lisäys onnistui!" || message === "Varauksen muokkaus onnistui!"
    || message === "Käyttäjän muokkaus onnistui!" || message === "Tiedot noudettu!" ? <Message color='green'><p>{message}</p></Message> :
        <Message negative><Message.Header>Virhe</Message.Header><p>{message}</p></Message>
};

export default Notification;