/* api to update forgotten password */
import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
const validateUpdatePasswordInput = require('../../validation/updatepassword');
const Op = Sequelize.Op;

const BCRYPT_SALT_ROUNDS = 10;
module.exports = (app, db) => {
    app.put('/api/updateForgottenPassword', (req, res) => {
        const {errors, isValid} = validateUpdatePasswordInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        db.User.findOne({
            where: {
                email: req.body.email,
                resetPasswordToken: req.body.resetPasswordToken,
                resetPasswordExpires: {
                    [Op.gt]: Date.now(),
                },
            },
        }).then(user => {
            if (user === null) {
                console.error('password reset link is invalid or has expired');
                res.status(403).send('password reset link is invalid or has expired');
            } else if (user != null) {
                console.log('user exists in db');
                //before updating the user's information in the database, their password is crypted
                bcrypt
                    .hash(req.body.password, BCRYPT_SALT_ROUNDS)
                    .then(hashedPassword => {
                        user.update({
                            password: hashedPassword,
                            //resetting these columns in the database
                            resetPasswordToken: null,
                            resetPasswordExpires: null,
                        });
                    })
                    .then(() => {
                        console.log('password updated');
                        res.status(200).send({ message: 'password updated' });
                    });
            } else {
                console.error('no user exists in db to update');
                res.status(401).json('no user exists in db to update');
            }
        });
    });
};