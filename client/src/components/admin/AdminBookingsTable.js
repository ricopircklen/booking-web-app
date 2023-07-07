import React, { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import { getAllRooms, getAllUsers } from '../../service/ClientService';
import BookingEditModal from './BookingEditModal';
import DeleteButtonConfirm from './DeleteButtonConfirm';

function AdminBookingsTable({ tableData, update }) {
  const [userData, setUserData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  let totalHours = 0;

  useEffect(() => {
    getAllUsers(setUserData);
    getAllRooms(setRoomData);
  }, []);

  //get room name by room Id (from booking bookingData)
  const roomName = roomId => {
    return roomData.map(room => {
      if (room.id === roomId) {
        return room.name;
      } else {
        return '';
      }
    });
  };

  //get room data for modal
  const roomForModal = roomId => {
    let name = '';
    for (var i = 0; i < roomData.length; i++) {
      if (roomData[i].id === roomId) {
        name = roomData[i];
      }
    }
    return name;
  };

  //get user name by user Id (from booking bookingData)
  const userName = userId => {
    return userData.map(user => {
      if (user.id === userId) {
        return user.lastName + ' ' + user.firstName;
      } else {
        return '';
      }
    });
  };

  //count booked hours
  const count = (endTime, startTime) => {
    const end = moment(endTime, 'HH:mm');
    const start = moment(startTime, 'HH:mm');
    return end.diff(start, 'hours', true);
  };

  const renderBookingTable = () => {
    return tableData.map(booking => {
      totalHours += count(booking.endTime, booking.startTime);
      return (
        <Table.Row key={booking.id}>
          <Table.Cell collapsing textAlign='center'>
            {moment(booking.bookingDate).format('DD.MM.YYYY')}
          </Table.Cell>
          <Table.Cell collapsing textAlign='center'>
            {booking.startTime.substring(0, 5)}-
            {booking.endTime.substring(0, 5)}
          </Table.Cell>
          <Table.Cell>{count(booking.endTime, booking.startTime)}</Table.Cell>
          <Table.Cell>{roomName(booking.roomId)}</Table.Cell>
          <Table.Cell>{userName(booking.userId)}</Table.Cell>
          <Table.Cell collapsing textAlign='center'>
            <BookingEditModal
              booking={booking}
              update={update}
              room={roomForModal(booking.roomId)}
            />
          </Table.Cell>
          <Table.Cell collapsing textAlign='center'>
            <DeleteButtonConfirm
              id={booking.id}
              type={'booking'}
              update={update}
            />
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  return (
    <Table unstackable celled color={'blue'}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Varauspäivä</Table.HeaderCell>
          <Table.HeaderCell>Kellonaika</Table.HeaderCell>
          <Table.HeaderCell>Tunnit</Table.HeaderCell>
          <Table.HeaderCell>Huone</Table.HeaderCell>
          <Table.HeaderCell>Käyttäjä</Table.HeaderCell>
          <Table.HeaderCell>Muokkaa</Table.HeaderCell>
          <Table.HeaderCell>Poista</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {tableData && <Table.Body>{renderBookingTable()}</Table.Body>}
      {tableData.length === 0 && (
        <Table.Body>
          <Table.Row>
            <Table.Cell>Ei varauksia valituilla ehdoilla</Table.Cell>
          </Table.Row>
        </Table.Body>
      )}
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell>Yhteensä</Table.HeaderCell>
          <Table.HeaderCell>tunteja</Table.HeaderCell>
          <Table.HeaderCell>{totalHours}</Table.HeaderCell>
          <Table.HeaderCell />
          <Table.HeaderCell />
          <Table.HeaderCell />
          <Table.HeaderCell />
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}

export default AdminBookingsTable;
