//this component is allows admin-users to inspect users' information, modify users and delete them
import React, { useState, useEffect } from 'react';
import { getAllUsersAdmin } from '../../service/ClientService';
import { Table, Icon } from 'semantic-ui-react';
import UserEditModal from './UserEditModal';
import DeleteButtonConfirm from './DeleteButtonConfirm';

function AdminAllUsers() {
  const [userData, setUserData] = useState([]);
  const [rerender, setRerender] = useState(1);

  useEffect(() => {
    getAllUsersAdmin(setUserData);
    setRerender(false);
  }, [rerender]);

  //function that updates the changed information immediately
  function update() {
    setRerender(rerender + 1);
  }

  /* Renders the rows for the user table. If user is admin, shows a green check mark in "admin" column, otherwise shows a red x.
   * UserEditModal opens a modal that allows admin to modify user's name, email and admin status, DeleteButton calls
   * for delete user function in ClientService.js. Both buttons update the info on the page immediately by calling the update function */
  const renderUserTable = () => {
    return userData.map(user => {
      if (user.isAdmin === true) {
        return (
          <Table.Row textAlign='center' key={user.id}>
            <Table.Cell>
              {user.lastName} {user.firstName}
            </Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell collapsing textAlign='center'>
              <Icon name='checkmark' color='green' />
            </Table.Cell>
            <Table.Cell collapsing textAlign='center'>
              <UserEditModal user={user} update={update} />
            </Table.Cell>
            <Table.Cell collapsing textAlign='center'>
              <DeleteButtonConfirm id={user.id} type={'user'} update={update} />
            </Table.Cell>
          </Table.Row>
        );
      } else {
        return (
          <Table.Row textAlign='center' key={user.id}>
            <Table.Cell>
              {user.lastName} {user.firstName}
            </Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell collapsing textAlign='center'>
              <Icon name='times' color='red' />
            </Table.Cell>
            <Table.Cell collapsing textAlign='center'>
              <UserEditModal user={user} update={update} />
            </Table.Cell>
            <Table.Cell collapsing textAlign='center'>
              <DeleteButtonConfirm id={user.id} type={'user'} update={update} />
            </Table.Cell>
          </Table.Row>
        );
      }
    });
  };

  return (
    <Table unstackable celled textAlign='center' color={'blue'}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Nimi</Table.HeaderCell>
          <Table.HeaderCell>Sähköposti</Table.HeaderCell>
          <Table.HeaderCell>Admin</Table.HeaderCell>
          <Table.HeaderCell>Muokkaa</Table.HeaderCell>
          <Table.HeaderCell>Poista</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{renderUserTable()}</Table.Body>
    </Table>
  );
}

export default AdminAllUsers;
