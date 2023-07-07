import React from 'react';
import {Button} from 'semantic-ui-react';
import {
    adminDeleteBooking,
    adminDeleteRoom,
    adminDeleteUser
} from '../../service/ClientService';

export default function DeleteButton({id, type, update}) {
    function deleteBooking() {
        if (type === 'booking') {
            if (window.confirm('Haluatko varmasti poistaa varauksen?')) {
                adminDeleteBooking(id)
                    .then(update)
            }
        } else if (type === 'room') {
            if (window.confirm('Haluatko varmasti poistaa huoneen?')) {
                adminDeleteRoom(id)
                    .then(update)
            }
        } else if (type === 'user') {
            if (window.confirm('Haluatko varmasti poistaa käyttäjän?')) {
                adminDeleteUser(id)
                    .then(update)
            }
        }
    }

    return (
        <Button negative basic icon onClick={deleteBooking}>
            <i className='trash icon'/>
        </Button>
    );
}
