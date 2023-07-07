import React, {useState} from 'react';
import {adminUpdateRoom} from "../../service/ClientService";
import {Button, Form, Icon, Modal} from "semantic-ui-react";
import Notification from "../Notification";

function RoomEditModal(props) {
    const [room] = useState(props.room);
    const [name, setName] = useState(props.room.name);
    const [capacity, setCapacity] = useState(props.room.capacity);
    const [available, setAvailable] = useState(props.room.available);
    const [equipment, setEquipment] = useState(props.room.equipment);
    const [message, setMessage] = useState(null);


    const handleNameChange = (e, {value}) => setName(value);
    const handleCapacityChange = (e, {value}) => setCapacity(value);
    const handleAvailableChange = () => setAvailable(!available);
    const handleEquipmentChange = (e, {value}) => setEquipment(value);

    const handleSubmit = e => {
        e.preventDefault();
        let nameWithoutSpaces = name.trim();
        const data = {
            name: nameWithoutSpaces,
            capacity: capacity,
            available: available,
            equipment: equipment
        };
                adminUpdateRoom(room.id, data)
                    .then(props.update);
                setMessage('Huoneen muokkaus onnistui!');
    };

    return(
        <Modal trigger={<Button primary basic icon><Icon className='edit'/></Button>}closeIcon>
            <Modal.Header style={{'borderBottomColor': '#0e6eb8', 'borderWidth': '4px'}}>Muokkaa huonetta</Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit}>
                    <Form.Input fluid label='Huoneen nimi' placeholder='Esimerkki(10)' onChange={handleNameChange} value={name}/>
                    <Form.Input type='number' fluid label='Huoneen kapasiteetti' placeholder='Huoneen kapasiteetti' onChange={handleCapacityChange} value={capacity}/>
                    <Form.Radio checked={!available} onChange={handleAvailableChange} label='Poissa käytöstä' toggle/>
                    <Form.Input fluid label='Huoneen varustelu' placeholder='Projektori, valkotaulu..' onChange={handleEquipmentChange} value={equipment}/>
                    <Form.Button primary>Vahvista muutos</Form.Button>
                    {message &&
                    <Notification message={message}/>
                    }
                </Form>
            </Modal.Content>
        </Modal>
    )
}

export default RoomEditModal;