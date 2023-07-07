//Form for room booking
//Validation in validation/BookingFormValidation
//Error/success message in Notification

import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal, Select } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import fi from 'date-fns/locale/fi';
import { getRoomData, getAllUsers } from '../service/ClientService';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import validate from '../validation/BookingFormValidation';
import Notification from '../components/Notification';
import { AuthContext } from '../context/auth';
import {
  createBooking,
  createBookingForAllRooms
} from '../service/ClientService';
import { withRouter } from 'react-router-dom';

function BookingForm(props) {
  const [room, setRoom] = useState('');
  const [user, setUser] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date().setHours(6, 0));
  const [endTime, setEndTime] = useState(new Date().setHours(22, 0));
  const [roomData, setRoomData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [message, setMessage] = useState(null);
  const [allRooms, setAllRooms] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getRooms();
    getUsers();
  }, []);

  //get room names to dropdown
  const getRooms = () => {
    getRoomData(list => {
      setRoomData(
        list
          .filter(room => room.available)
          .map(room => {
            return { key: room.id, text: room.name, value: room.id };
          })
      );
    });
  };

  //get user names to dropdown
  const getUsers = () => {
    getAllUsers(list => {
      setUserData(
        list.map(user => {
          let text = "";
          !user.lastName && !user.firstName ? text = "" : text = user.lastName + " " + user.firstName;
          return {
            key: user.id,
            text: text,
            value: user.id
          };
        })
      );
    });
  };

  //handle changes
  const handleRoomChange = (e, { value }) => setRoom(value);
  const handleUserChange = (e, { value }) => setUser(value);
  const handleDateChange = date => setStartDate(date);
  const handleStartTimeChange = time => setStartTime(time);
  const handleEndTimeChange = time => setEndTime(time);
  const handleAllRoomsChange = () => setAllRooms(!allRooms);

  //handle validation and submitting form
  const handleSubmit = e => {
    e.preventDefault();

    // check if admin has chosen to book all rooms at once
    if (allRooms) {
      let allRoomsData = {
        user_id: user,
        booking_date: moment(startDate).format('YYYY-MM-DD'),
        start_time: moment(startTime).format('HH:mm:01'),
        end_time: moment(endTime).format('HH:mm')
      };
      createBookingForAllRooms(allRoomsData).then(function(success) {
        if (success) {
          setRoom('');
          setStartDate(new Date());
          setStartTime(new Date());
          setEndTime(new Date());
          setMessage('Varaus onnistui');
          setTimeout(() => {
            props.history.push('/login');
          }, 1500);
        } else {
          setMessage('Varaus ei onnistunut');
        }
      });
    } else {
      let data = {};
      if (currentUser.isadmin) {
        data = {
          user_id: user,
          room_id: room,
          booking_date: moment(startDate).format('YYYY-MM-DD'),
          start_time: moment(startTime).format('HH:mm:01'),
          end_time: moment(endTime).format('HH:mm')
        };
      } else {
        data = {
          user_id: currentUser.id,
          room_id: room,
          booking_date: moment(startDate).format('YYYY-MM-DD'),
          start_time: moment(startTime).format('HH:mm:01'),
          end_time: moment(endTime).format('HH:mm')
        };
      }
      try {
        if (validate(data)) {
          createBooking(data).then(function(success) {
            if (success) {
              setRoom('');
              setStartDate(new Date());
              setStartTime(new Date());
              setEndTime(new Date());
              setMessage('Varaus onnistui');
              setTimeout(() => {
                props.history.push('/login');
              }, 1500);
            } else {
              setMessage('Varaus ei onnistunut');
            }
          });
        }
        //error messages
      } catch (e) {
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
    }
  };

  return (
    <div>
      <Modal trigger={<Button primary>Varaa huone</Button>} closeIcon>
        <Modal.Header
          style={{ borderBottomColor: '#0e6eb8', borderWidth: '4px' }}
        >
          Uusi varaus
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
            {currentUser.isadmin && (
              <Form.Group unstackable widths={2}>
                <Form.Radio
                  checked={allRooms}
                  onChange={handleAllRoomsChange}
                  label='Varaa kaikki huoneet'
                  toggle
                />
              </Form.Group>
            )}
            {currentUser.isadmin && (
              <Form.Group unstackable widths={2}>
                <Form.Field
                  control={Select}
                  label='Valitse käyttäjä'
                  options={userData}
                  placeholder='Käyttäjä'
                  onChange={handleUserChange}
                  value={user}
                />
              </Form.Group>
            )}
            <Form.Group>
              <Form.Input label='Päivämäärä'>
                {currentUser.isadmin && (
                <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={startDate}
                    onChange={handleDateChange}
                    locale={fi}
                    onFocus={(e) => e.target.readOnly = true}
                />)}
                {!currentUser.isadmin && (
                <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={startDate}
                    onChange={handleDateChange}
                    minDate={subDays(new Date(), 0)}
                    maxDate={addDays(new Date(), 31)}
                    locale={fi}
                    onFocus={(e) => e.target.readOnly = true}
                />)}
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
            <Button primary type='submit'>
              Varaa
            </Button>
            {message && <Notification message={message} />}
          </Form>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default withRouter(BookingForm);
