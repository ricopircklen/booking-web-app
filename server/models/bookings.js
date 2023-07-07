//Defines database table for bookings and their attributes
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'booking',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false
      },
      isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      underscored: true
    }
  );
  //creates database relations: booking has one user and one room
  Booking.associate = function(models) {
    Booking.belongsTo(models.User);
    Booking.belongsTo(models.Room);
  };
  return Booking;
};
