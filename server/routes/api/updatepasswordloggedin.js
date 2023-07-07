/* api to update the user's password */
import bcrypt from 'bcrypt';
const BCRYPT_SALT_ROUNDS = 10;
const withAuth = require('../../middleware/middleware');
const validateUpdatePasswordInput = require('../../validation/updatepassword');

module.exports = (app, db) => {
    app.put('/api/updatePassword', withAuth, (req, res) => {
        const {errors, isValid} = validateUpdatePasswordInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        db.User.findOne({
            where: {
                email: req.body.email
            }
        })
            .then((user) => {
                if (user === null) {
                    console.error('no such user in db');
                    res.status(404).send('user not found in database');
                } else if (user != null) {
                    console.log('user found in db');
                    //before updating the user's information in the database, their password is crypted
                    bcrypt
                        .hash(req.body.password, BCRYPT_SALT_ROUNDS)
                        .then((hashedPassword) => {
                            user.update({
                                password: hashedPassword,
                            });
                        })
                        .then(() => {
                            console.log('password updated');
                            res.status(200).send({message: 'password updated'});
                        });
                }
            });
    });
};