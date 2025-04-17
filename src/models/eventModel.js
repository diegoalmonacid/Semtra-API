export default (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
      eventId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      ticketId: {
        type: DataTypes.BIGINT,
      },
      eventType: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    }, {
      tableName: 'events',
      timestamps: true,
    });
    return Event;
  };
  