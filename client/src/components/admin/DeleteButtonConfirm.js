import React, { useState, useEffect } from 'react';
import { Button, Confirm } from 'semantic-ui-react';
import {
  adminDeleteBooking,
  adminDeleteRoom,
  adminDeleteUser
} from '../../service/ClientService';

export default function DeleteButtonConfirm({ id, type, update }) {
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState('');

  useEffect(() => {
    if (type === 'booking') {
      setHeader('Haluatko varmasti poistaa varauksen?');
    } else if (type === 'room') {
      setHeader('Haluatko varmasti poistaa huoneen?');
    } else if (type === 'user') {
      setHeader('Haluatko varmasti poistaa käyttäjän?');
    }
  },[type]);

  function deleteProcedure() {
    if (type === 'booking') {
      adminDeleteBooking(id)
        .then(update)
        .then(setOpen(false));
    } else if (type === 'room') {
      adminDeleteRoom(id)
        .then(update)
        .then(setOpen(false));
    } else if (type === 'user') {
      adminDeleteUser(id)
        .then(update)
        .then(setOpen(false));
    }
  }

  const show = () => {
    setOpen(true);
  };

  //if user doesn't cancel booking
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        negative
        basic
        icon
        onClick={event => {
          show();
        }}
      >
        <i className='trash icon' />
      </Button>
      <Confirm
        open={open}
        onCancel={handleCancel}
        cancelButton={<Button negative>Ei</Button>}
        confirmButton={
          <Button
            positive
            labelPosition='right'
            icon='checkmark'
            content='Kyllä'
          />
        }
        onConfirm={() => deleteProcedure()}
        header={header}
        content='Tätä toimintoa ei voi perua.'
      />
      {/*    <Modal
        size='mini'
        trigger={
          <Button negative basic icon>
            <i className='trash icon' />
          </Button>
        }
      >
        <Modal.Header
        // style={{ borderBottomColor: '#0e6eb8', borderWidth: '4px' }}
        >
          {' '}
          Haluatko varmasti poistaa varauksen?
        </Modal.Header>

        <Modal.Actions>
          <Button negative closeIcon>
            Ei
          </Button>
          <Button
            positive
            labelPosition='right'
            icon='checkmark'
            content='Kyllä'
            onClick={deleteBooking}
          />
        </Modal.Actions>
      </Modal> */}
    </div>
  );
}
