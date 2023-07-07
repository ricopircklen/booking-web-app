/* api to check if the reset password link is valid */
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

module.exports = (app, db) => {
    app.get('/api/reset', (req, res) => {
        //searches for a user in database with the random token and expiration time that is greater than current time
        db.User.findOne({
            where: {
                resetPasswordToken: req.query.resetPasswordToken,
                resetPasswordExpires: {
                    [Op.gt]: Date.now(),
                },
            },
        }).then((user) => {
            //if no user with given parameters is found, return error, else return ok
            if (user === null) {
                console.error('password reset link is invalid or has expired');
                res.status(403).send('password reset link is invalid or has expired');
            } else {
                res.status(200).send({
                    email: user.email,
                    message: 'password reset link ok',
                });
            }
        });
    });
};