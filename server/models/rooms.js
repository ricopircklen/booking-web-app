//defines database table for rooms and their attributes
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    'room',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      equipment: DataTypes.TEXT
    },
    {
      underscored: true
    }
  );
  //defines database relation: one room has many bookings
  Room.associate = function(models) {
    Room.hasMany(models.Booking);
  };
  return Room;
};
