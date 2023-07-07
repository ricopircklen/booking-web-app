/* api to invite a new user */
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const password = process.env.GMAILPW;
const sender = process.env.GMAIL_ADDRESS;
const  baseUrl = 'http://localhost:3000';

module.exports = (app, db) => {
    // @route POST api/inviteNewUser
    /* @desc searches for a user in database based on email (unique value). If email exists in database, sends an error message. If not, creates a new user
     with given email + creates individual token for registration. Creates registration email with a link including the user specified token. Sends the email.*/
    // @access Public
    app.post('/api/inviteNewUser', (req, res) => {
        if (req.body.email === '') {
            res.status(400).send('email required');
        }
        console.error(req.body.email);
        db.User.findOne({
            where: {
                email: req.body.email,
            },
        }).then((user) => {
            if (user) {
                console.error('email already in database');
                res.status(403).send('email already in db');
            } else {
                //creates a random token for the registration link url
                const token = crypto.randomBytes(20).toString('hex');
                //creates a new user in the database with the given email and the random token
                db.User.create({
                    email: req.body.email,
                    registerUserToken: token
                })
                    .then(newuser => res.json(newuser))
                    .catch(err => console.log(err));

                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: sender,
                        pass: password
                    },
                });
                //constructs the registration email
                const mailOptions = {
                    from: 'roba43tilavaraus@gmail.com',
                    to: req.body.email,
                    subject: 'Rekisteröityminen Roba43-tilavarauspalveluun',
                    text: 'Sait tämän viestin, koska sinut on kutsuttu rekisteröitymään Roba43:n tilavarauspalveluun.\n\n' +
                        'Rekisteröityäksesi klikkaa tätä linkkiä tai kopioi se selaimeesi:\n\n' +
                        baseUrl + '/signup/' + token + '\n\n' +
                        'Mikäli et halua rekisteröityä ja tehdä varauksia, jätä tämä viesti huomioimatta.\n\n' +
                        'Tämä on automaattisesti luotu viesti, ethän vastaa tähän viestiin. Mikäli sinulla on kysyttävää rekisteröitymiseen liittyen, lähetä viesti osoitteeseen vesa@kullberg.fi'
                };
                console.log('sending mail');

                transporter.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.error('there was an error: ', err);
                    } else {
                        console.log('here is the res: ', response);
                        // res.status(200).send({message:'invitation email sent'});
                    }
                });
            }
        });
    });
};