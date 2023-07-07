import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../../service/ClientService';
import { Header, Table } from 'semantic-ui-react';
import DeleteButtonConfirm from './DeleteButtonConfirm';
import RoomEditModal from './RoomEditModal';
import RoomAddModal from './RoomAddModal';

function Rooms() {
  const [roomData, setRoomData] = useState([]);
  const [rerender, setRerender] = useState(1);

  useEffect(() => {
    getAllRooms(setRoomData);
    setRerender(false);
  }, [rerender]);

  function update() {
    setRerender(rerender + 1);
  }

  const renderRoomTable = () => {
    return roomData.map(room => {
      return (
        <Table.Row textAlign='center' key={room.id}>
          <Table.Cell>{room.name}</Table.Cell>
          <Table.Cell collapsing textAlign='center'>
            <RoomEditModal room={room} update={update} />
          </Table.Cell>
          <Table.Cell collapsing textAlign='center'>
            <DeleteButtonConfirm id={room.id} type={'room'} update={update} />
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  return (
    <div>
      <Header as='h3' attached='top' block>
        Huoneet
      </Header>
      <Table unstackable celled color={'blue'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign='center'>Nimi</Table.HeaderCell>
            <Table.HeaderCell>Muokkaa</Table.HeaderCell>
            <Table.HeaderCell>Poista</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {renderRoomTable()}
          <Table.Row textAlign='center'>
            <Table.Cell style={{ fontWeight: 'bold' }}>Lisää huone</Table.Cell>
            <Table.Cell collapsing textAlign='center'>
              <RoomAddModal update={update} />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default Rooms;
