/* api for forgotten password */
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const password = process.env.GMAILPW;
const sender = process.env.GMAIL_ADDRESS;
const  baseUrl = 'http://localhost:3000';

module.exports = (app,db) => {
    // @route POST api/forgot
    /* @desc searches for a user in database based on email (unique value). If email exists in database, creates a token and sets it
    to expire within 1 h. Creates password reset email with a link including the user specified token. Sends the email.*/
    // @access Public
    app.post('/api/forgot', (req, res) => {
        if (req.body.email === '') {
            res.status(400).send('email required');
        }
        console.error(req.body.email);
        db.User.findOne({
            where: {
                email: req.body.email,
            },
        }).then((user) => {
            if (user === null) {
                console.error('email not in database');
                res.status(403).send('email not in db');
            } else {
                //creates a random token and sets it to expire 1 h after the email is sent
                const token = crypto.randomBytes(20).toString('hex');
                user.update({
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 3600000, //current time + 1 h
                });

                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: sender,
                        pass: password
                    },
                });
                //constructs the email
                const mailOptions = {
                    from: 'roba43tilavaraus@gmail.com',
                    to: user.email,
                    subject: 'Roba43 salasanan palauttaminen',
                    text: 'Sait tämän viestin, koska olet pyytänyt salasanasi palauttamista Roba43:n tilavarauspalveluun.\n\n' +
                        'Salasanasi uudelleenasettamiseksi klikkaa tätä linkkiä tai kopioi se selaimeesi:\n\n' +
                        baseUrl + '/reset/' + token + '\n\n' +
                        'Salasanan vaihtolinkki on voimassa yhden tunnin sen lähettämishetkestä.\n' +
                        'Mikäli et pyytänyt salasanasi palauttamista, jätä tämä viesti huomioimatta, niin salasanasi säilyy ennallaan.\n\n' +
                        'Tämä on automaattisesti luotu viesti, ethän vastaa tähän viestiin. Mikäli sinulla on kysyttävää salasanan palauttamiseen liittyen, lähetä viesti osoitteeseen vesa@kullberg.fi'
                };
                console.log('sending mail');

                transporter.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.error('there was an error: ', err);
                    } else {
                        console.log('here is the res: ', response);
                        res.status(200).send('recovery email sent');
                    }
                });
            }
        });
    });
};