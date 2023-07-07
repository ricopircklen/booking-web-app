const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET;
const bcrypt = require('bcrypt');
const withAuth = require('../../middleware/middleware');
const BCRYPT_SALT_ROUNDS = 10;
import Sequelize, { not } from 'sequelize';
const Op = Sequelize.Op;

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUserSettingsInput = require('../../validation/usersettings');

module.exports = (app, db) => {
  // @route   GET api/users/admin
  // @desc    Get all users for admin panel
  // @access  Private
  app.get('/api/users/admin', withAuth, (req, res) =>
    db.User.findAll({
      attributes: {
        exclude: ['password']
      },
      order: [['lastName', 'ASC']]
    })
      .then(result => res.json(result))
      .catch(err => {
        console.error('Error with GET All', err.message);
        res.status(400).send(err.message);
      })
  );

  // @route   GET api/users
  // @desc    Get all users
  // @access  Private
  app.get('/api/users', withAuth, (req, res) =>
    db.User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'isAdmin'],
      order: [['lastName', 'ASC']]
    })
      .then(result => res.json(result))
      .catch(err => {
        console.error('Error with GET All', err.message);
        res.status(400).send(err.message);
      })
  );

  // simple helper function for token validation
  app.get('/api/checktoken', withAuth, (req, res) => res.sendStatus(200));

  // @route   GET api/user/:id
  // @desc    Get user by id
  // @access  Private
  app.get('/api/user/:id', withAuth, (req, res) =>
    db.User.findByPk(req.params.id)
      .then(result => res.json(result))
      .catch(err => {
        console.error('User not found', err.message);
        res.status(404).send(err.message);
      })
  );

  // @route   GET api/user/:id
  // @desc    Check if there is a user in the database with given email and NOT with given id
  // @access  Private
  app.get('/api/user', (req, res) =>
    db.User.findOne({
      where: {
        id: {
          [Op.not]: req.query.id
        },
        email: req.query.email
      }
    }).then(user => {
      if (user != null) {
        res.status(400).send({ message: 'email already in db' });
      } else {
        res.status(200).send({ message: 'email ok' });
      }
    })
  );

  // @route   PUT api/user
  // @desc    Modify existing user
  // @access  Private
  app.put('/api/user/:id', withAuth, (req, res) => {
    const { errors, isValid } = validateUserSettingsInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    db.User.findByPk(req.params.id).then(user => {
      if (user === null) {
        console.error('no such user in db');
        res.status(404).send('user not found in database');
      } else if (user != null) {
        console.log('user exists in db');
        user
          .update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            isAdmin: req.body.isAdmin
          })
          .then(() => {
            console.log('user updated');
            res.status(200).send({ message: 'user updated' });
          });
      }
    });
  });

  // @route   DELETE api/user/:id
  // @desc    Delete existing user
  // @access  Private
  app.delete('/api/user/:id', withAuth, (req, res) =>
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(result => res.json(result))
  );

  // @route   GET api/users/login
  // @desc    Login User / Returning JWT Token
  // @access  Private
  app.post('/api/users/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Find user by email
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'Sähköposti tai salasana on virheellinen.';
        return res.status(400).json(errors);
      }

      // Check Password
      bcrypt.compare(req.body.password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = {
            id: user.id,
            email: user.email,
            isadmin: user.isAdmin,
            username: user.firstName
          }; // Create JWT Payload

          // Sign Token
          jwt.sign(payload, SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
            res.json({
              username: user.firstName,
              id: user.id,
              isadmin: user.isAdmin,
              token
            });
          });
        } else {
          errors.email = 'Sähköposti tai salasana on virheellinen.';
          return res.status(400).json(errors);
        }
      });
    });
  });

  // @route   GET api/users/checkRegistrationToken
  // @desc    Check if user's email registration link is valid
  // @access  Private
  app.get('/api/users/checkRegistrationToken', (req, res) => {
    db.User.findOne({
      where: {
        registerUserToken: req.query.registerUserToken
      }
    }).then(user => {
      if (user === null) {
        console.error('registration link is invalid');
        res.status(403).send('registration link is invalid');
      } else {
        res.status(200).send({
          email: user.email,
          message: 'registration link ok'
        });
      }
    });
  });

  // @route   PUT api/users/register
  // @desc    Register user i.e. update the user's information
  // @access  Private
  app.put('/api/users/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    db.User.findOne({
      where: {
        email: req.body.email,
        registerUserToken: req.body.registerUserToken
      }
    }).then(user => {
      if (user === null) {
        console.error('registration link is invalid');
        res.status(403).send('registration link is invalid');
      } else if (user) {
        console.log('user found in db');
        //before updating the user's information in database, crypt the user's password
        bcrypt
          .hash(req.body.password, BCRYPT_SALT_ROUNDS)
          .then(hashedPassword => {
            user
              .update({
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                //reset the registration token column in database
                registerUserToken: null
              })
              .then(() => {
                console.log('user updated');
                res.status(200).send({ message: 'user updated' });
              });
          });
      } else {
        console.error('no user exists in db to update');
        res.status(401).json('no user exists in db to update');
      }
    });
  });
};
