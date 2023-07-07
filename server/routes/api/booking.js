import Sequelize, { or } from 'sequelize';
import moment from 'moment';

const withAuth = require('../../middleware/middleware');

const Op = Sequelize.Op;

module.exports = (app, db) => {
  // @route   GET api/bookings
  // @desc    Get all bookings
  // @access  Private
  app.get('/api/bookings', withAuth, (req, res) =>
    db.Booking.findAll({
      order: [['bookingDate', 'ASC'], ['startTime', 'ASC']]
    })
      .then(result => res.json(result))
      .catch(err => {
        console.error('Error with GET All', err.message);
        res.status(400).send(err.message);
      })
  );

  // @route   POST api/booking
  // @desc    Post new booking
  // @access  Private
  /* this checks if there is already booking at that time where user is trying to create new booking. */
  app.post('/api/booking', withAuth, (req, res) => {
    var overlapping = [];
    db.Booking.findAll({
      where: {
        bookingDate: req.body.booking_date,
        roomId: req.body.room_id
      }
    })
      .then(bookings => {
        for (var i = 0; i < bookings.length; i++) {
          if (
            moment(req.body.start_time, 'HH:mm:ss').isSameOrAfter(
              moment(bookings[i].startTime, 'HH:mm:ss')
            ) &&
            moment(req.body.start_time, 'HH:mm:ss').isSameOrBefore(
              moment(bookings[i].endTime, 'HH:mm:ss')
            )
          ) {
            overlapping.push(bookings[i]);
          } else if (
            moment(req.body.end_time, 'HH:mm:ss').isSameOrAfter(
              moment(bookings[i].startTime, 'HH:mm:ss')
            ) &&
            moment(req.body.end_time, 'HH:mm:ss').isSameOrBefore(
              moment(bookings[i].endTime, 'HH:mm:ss')
            )
          ) {
            overlapping.push(bookings[i]);
          } else if (
            moment(bookings[i].startTime, 'HH:mm:ss') &&
            moment(bookings[i].endTime, 'HH:mm:ss').isBetween(
              moment(req.body.start_time, 'HH:mm:ss'),
              moment(req.body.end_time, 'HH:mm:ss')
            )
          ) {
            overlapping.push(bookings[i]);
          }
        }
      })
      .then(() => {
        if (overlapping.length !== 0) {
          res.status(403).send('overlapping booking');
        } else {
          console.log('no overlapping booking');
          db.Booking.create({
            userId: req.body.user_id,
            roomId: req.body.room_id,
            bookingDate: req.body.booking_date,
            startTime: req.body.start_time,
            endTime: req.body.end_time,
            isValid: req.body.is_valid
          })
            .then(result => res.json(result))
            .catch(err => {
              console.error('Error with POST', err.message);
              res.status(400).send(err.message);
            });
        }
      });
  });

  // @route   POST api/booking/allrooms
  // @desc    Post new booking for all rooms simultaneously
  // @access  Private
  /* this checks if there is already booking at that time where user is trying to create new booking. */
  app.post('/api/booking/allrooms', withAuth, (req, res) => {
    var overlapping = [];
    db.Booking.findAll({
      where: {
        bookingDate: req.body.booking_date
      }
    })
      .then(bookings => {
        for (var i = 0; i < bookings.length; i++) {
          if (
            moment(req.body.start_time, 'HH:mm:ss').isSameOrAfter(
              moment(bookings[i].startTime, 'HH:mm:ss')
            ) &&
            moment(req.body.start_time, 'HH:mm:ss').isSameOrBefore(
              moment(bookings[i].endTime, 'HH:mm:ss')
            )
          ) {
            overlapping.push(bookings[i]);
          } else if (
            moment(req.body.end_time, 'HH:mm:ss').isSameOrAfter(
              moment(bookings[i].startTime, 'HH:mm:ss')
            ) &&
            moment(req.body.end_time, 'HH:mm:ss').isSameOrBefore(
              moment(bookings[i].endTime, 'HH:mm:ss')
            )
          ) {
            overlapping.push(bookings[i]);
          } else if (
            moment(bookings[i].startTime, 'HH:mm:ss') &&
            moment(bookings[i].endTime, 'HH:mm:ss').isBetween(
              moment(req.body.start_time, 'HH:mm:ss'),
              moment(req.body.end_time, 'HH:mm:ss')
            )
          ) {
            overlapping.push(bookings[i]);
          }
        }
      })
      .then(() => {
        console.log(overlapping);
        if (overlapping.length !== 0) {
          res.status(403).send('overlapping booking');
        } else {
          console.log('no overlapping booking');
          db.Room.findAll()
            .then(rooms => {
              for (let i = 0; i < rooms.length; i++) {
                db.Booking.create({
                  userId: req.body.user_id,
                  roomId: rooms[i].id,
                  bookingDate: req.body.booking_date,
                  startTime: req.body.start_time,
                  endTime: req.body.end_time,
                  isValid: req.body.is_valid
                });
              }
            })
            .then(result => res.json(result))
            .catch(err => {
              res.status(400).send(err.message);
            });
        }
      });
  });

  // @route   GET api/booking/:id
  // @desc    Get booking by id
  // @access  Private
  app.get('/api/booking/:id', withAuth, (req, res) =>
    db.Booking.findByPk(req.params.id)
      .then(result => res.json(result))
      .catch(err => {
        console.error('Booking not found', err.message);
        res.status(404).send(err.message);
      })
  );

  // @route   GET api/userbookings/:userId
  // @desc    Get all bookings for user
  // @access  Private
  app.get('/api/userbookings/:id', withAuth, (req, res) =>
    db.Booking.findAll({
      where: {
        userId: req.params.id
      },
      order: [['bookingDate', 'ASC'], ['startTime', 'ASC']]
    })
      .then(result => res.json(result))
      .catch(err => {
        console.error('Error with GET All', err.message);
        res.status(400).send(err.message);
      })
  );

  // @route   PUT api/booking/:id
  // @desc    Modify existing booking
  // @access  Private
  // this checks if there is already booking at that time where user is trying to update booking.
  app.put('/api/booking/:id', withAuth, (req, res) => {
    var overlapping = [];
    db.Booking.findAll({
      where: {
        bookingDate: req.body.booking_date,
        roomId: req.body.room_id
      }
    })
      .then(bookings => {
        for (var i = 0; i < bookings.length; i++) {
          if (
            moment(req.body.start_time, 'HH:mm:ss').isSameOrAfter(
              moment(bookings[i].startTime, 'HH:mm:ss')
            ) &&
            moment(req.body.start_time, 'HH:mm:ss').isSameOrBefore(
              moment(bookings[i].endTime, 'HH:mm:ss')
            )
          ) {
            if (req.params.id !== bookings[i].id) {
              overlapping.push(bookings[i]);
            }
          } else if (
            moment(req.body.end_time, 'HH:mm:ss').isSameOrAfter(
              moment(bookings[i].startTime, 'HH:mm:ss')
            ) &&
            moment(req.body.end_time, 'HH:mm:ss').isSameOrBefore(
              moment(bookings[i].endTime, 'HH:mm:ss')
            )
          ) {
            if (req.params.id !== bookings[i].id) {
              overlapping.push(bookings[i]);
            }
          } else if (
            moment(bookings[i].startTime, 'HH:mm:ss') &&
            moment(bookings[i].endTime, 'HH:mm:ss').isBetween(
              moment(req.body.start_time, 'HH:mm:ss'),
              moment(req.body.end_time, 'HH:mm:ss')
            )
          ) {
            if (req.params.id !== bookings[i].id) {
              overlapping.push(bookings[i]);
            }
          }
        }
      })
      .then(() => {
        if (overlapping.length !== 0) {
          res.status(403).send('overlapping booking');
        } else {
          console.log('no overlapping booking');
          db.Booking.update(
            {
              userId: req.body.user_id,
              roomId: req.body.room_id,
              bookingDate: req.body.booking_date,
              startTime: req.body.start_time,
              endTime: req.body.end_time,
              isValid: req.body.is_valid
            },
            {
              where: {
                id: req.params.id
              }
            }
          )
            .then(result => res.json(result))
            .catch(err => {
              console.error('Error with PUT', err.message);
              res.status(400).send(err.message);
            });
        }
      });
  });

  // @route   DELETE api/booking/:id
  // @desc    Delete existing booking
  // @access  Private
  app.delete('/api/booking/:id', withAuth, (req, res) =>
    db.Booking.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(result => res.json(result))
      .catch(err => {
        console.error('Error with DELETE', err.message);
        res.status(400).send(err.message);
      })
  );
};
