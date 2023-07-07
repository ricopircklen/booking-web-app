//defines database table for users and their attributes
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        unique: {
          args: true,
          msg: 'Email address is already in use!'
        }
      },
      password: {
        type: DataTypes.STRING
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      //the following columns are used if user wants to reset their password by email
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
      //this column is used when user is invited to register
      registerUserToken: DataTypes.STRING
    },
    {
      underscored: true,
      instanceMethods: {
        validPassword: function(password) {
          return bcrypt.compare(password, this.password);
        }
      }
    }
  );
  //defines database relation: user can have many bookings
  User.associate = function(models) {
    User.hasMany(models.Booking);
  };
  return User;
};
