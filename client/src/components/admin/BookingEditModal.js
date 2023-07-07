import React, { useState, useEffect } from 'react';
import { adminUpdateBooking, getRoomData } from '../../service/ClientService';
import { Button, Form, Icon, Modal, Select } from 'semantic-ui-react';
import Notification from '../Notification';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import fi from 'date-fns/locale/fi';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import validate from '../../validation/BookingFormValidation';

function BookingEditModal(props) {
  const [booking, setBooking] = useState();
  const [room, setRoom] = useState(props.room.id);
  const [startDate, setStartDate] = useState(
    new Date(props.booking.bookingDate)
  );
  const [startTime, setStartTime] = useState(
    new Date().setHours(
      props.booking.startTime.substring(0, props.booking.startTime.length - 6),
      props.booking.startTime.substring(3, props.booking.startTime.length - 3)
    )
  );
  const [endTime, setEndTime] = useState(
    new Date().setHours(
      props.booking.endTime.substring(0, props.booking.endTime.length - 6),
      props.booking.endTime.substring(3, props.booking.endTime.length - 3)
    )
  );
  const [roomData, setRoomData] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setBooking(props.booking);
    getRooms();
  }, [props.booking]);

  //get room names to dropdown
  const getRooms = () => {
    getRoomData(list => {
      setRoomData(
        list.map(room => {
          return { key: room.id, text: room.name, value: room.id };
        })
      );
    });
  };

  //handle changes
  const handleRoomChange = (e, { value }) => {
    setRoom(value);
  };
  const handleDateChange = date => setStartDate(date);
  const handleStartTimeChange = time => {
    setStartTime(time);
  };
  const handleEndTimeChange = time => setEndTime(time);

  //handle booking edit submit
  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      user_id: booking.userId,
      room_id: room,
      booking_date: moment(startDate).format('YYYY-MM-DD'),
      start_time: moment(startTime).format('HH:mm:01'),
      end_time: moment(endTime).format('HH:mm')
    };
    try{
      if(validate(data)){
        adminUpdateBooking(booking.id, data).then(function(success) {
          if (success) {
            props.update();
            setMessage('Varauksen muokkaus onnistui!');
          } else {
            setMessage('Varauksen muokkaus ei onnistunut');
          }
        });
      }
    }catch (e) {
      if (e.message === 'start time is before 6 am') {
        setMessage('Huoneita voi varata klo 6-22');
      } else if (e.message === 'end time is after 22 am') {
        setMessage('Huoneita voi varata klo 6-22');
      } else if (e.message === 'room was not set') {
        setMessage('Huonetta ei ole valittu');
      } else if (e.message === 'start time cannot be after endtime') {
        setMessage('Tarkista alkamis- ja päättymisaika');
      } else if (e.message === 'start time cannot be after endtime') {
        setMessage('Tarkista alkamis- ja päättymisaika');
      } else if (e.message === 'start and end time must be even or half hour') {
        setMessage('Alkamis- ja päättymisajan tulee olla tasalta tai puolelta');
      } else if (e.message === 'start and end time cant be same') {
        setMessage('Alkamis- ja päättymisaika eivät voi olla samat');
      } else {
        setMessage('Tuntematon virhe');
      }
    }
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  //booking editing modal & form
  return (
    <Modal
      trigger={
        <Button primary basic icon>
          <Icon className='edit' />
        </Button>
      }
      closeIcon
    >
      <Modal.Header
        style={{ borderBottomColor: '#0e6eb8', borderWidth: '4px' }}
      >
        Muokkaa varausta
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Group unstackable widths={2}>
            <Form.Field
              control={Select}
              label='Valitse huone'
              options={roomData}
              placeholder='Huone'
              onChange={handleRoomChange}
              value={room}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input label='Päivämäärä'>
              <DatePicker
                dateFormat='dd/MM/yyyy'
                selected={startDate}
                onChange={handleDateChange}
                locale={fi}
                onFocus={(e) => e.target.readOnly = true}
              />
            </Form.Input>
          </Form.Group>
          <Form.Group>
            <Form.Input label='Alkaa'>
              <DatePicker
                selected={startTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                showTimeSelectOnly
                minTime={setHours(setMinutes(new Date(), 0), 6)}
                maxTime={setHours(setMinutes(new Date(), 30), 21)}
                timeIntervals={30}
                timeFormat='p'
                locale={fi}
                dateFormat='p'
                timeCaption='Klo'
                onFocus={(e) => e.target.readOnly = true}
              />
            </Form.Input>
          </Form.Group>
          <Form.Group>
            <Form.Input label='Päättyy'>
              <DatePicker
                selected={endTime}
                onChange={handleEndTimeChange}
                showTimeSelect
                showTimeSelectOnly
                minTime={setHours(setMinutes(new Date(), 30), 6)}
                maxTime={setHours(setMinutes(new Date(), 0), 22)}
                timeIntervals={30}
                timeFormat='p'
                locale={fi}
                dateFormat='p'
                timeCaption='Klo'
                onFocus={(e) => e.target.readOnly = true}
              />
            </Form.Input>
          </Form.Group>
          <Form.Button primary>Vahvista muutos</Form.Button>
          {message && <Notification message={message} />}
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default BookingEditModal;
