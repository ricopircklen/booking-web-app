import React, {useState} from 'react';
import {adminCreateRoom} from "../../service/ClientService";
import {Button, Form, Icon, Modal} from "semantic-ui-react";
import Notification from "../Notification";
import validateRoomEditModal from '../../validation/RoomEditModalValidation';

function RoomAddModal(props) {
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [equipment, setEquipment] = useState("");
    const [message, setMessage] = useState(null);

    const handleNameChange = (e, {value}) => setName(value);
    const handleCapacityChange = (e, {value}) => setCapacity(value);
    const handleEquipmentChange = (e, {value}) => setEquipment(value);

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            name: name,
            capacity: capacity,
            available: true,
            equipment: equipment
        }
        try {
            if(validateRoomEditModal(data)) {
                adminCreateRoom(data)
                    .then(props.update)
                setMessage('Huoneen lisäys onnistui!')
            }
        } catch (e) {
            if (e.message === 'Uutta nimeä ei ole syötetty') {
                setMessage('Uutta nimeä ei ole syötetty')
            } else if (e.message === 'Huoneen uutta kapasiteettia ei ole syötetty') {
                setMessage('Huoneen uutta kapasiteettia ei ole syötetty')
            }
        }
    }

    return(
        <Modal trigger={<Button positive basic icon><Icon className='add circle'/></Button>} closeIcon>
            <Modal.Header style={{'borderBottomColor': '#0e6eb8', 'borderWidth': '4px'}}>Lisää uusi huone</Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit}>
                    <Form.Input fluid label='Huoneen nimi' placeholder='Esimerkki(10)' onChange={handleNameChange} value={name}/>
                    <Form.Input type='number' fluid label='Huoneen kapasiteetti' placeholder='Huoneen kapasiteetti' onChange={handleCapacityChange} value={capacity}/>
                    <Form.Input fluid label='Huoneen varustelu' placeholder='Projektori, valkotaulu..' onChange={handleEquipmentChange} value={equipment}/>
                    <Form.Button primary>Vahvista huoneen lisäys</Form.Button>
                    {message &&
                    <Notification message={message}/>
                    }
                </Form>
            </Modal.Content>
        </Modal>
    )
}

export default RoomAddModal;