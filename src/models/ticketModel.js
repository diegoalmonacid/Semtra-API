
export default (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    ticketId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true, // Sequelize maneja las secuencias automáticamente
    },
    executiveId: {
    type: DataTypes.TEXT,
    allowNull: true,
    },
    partnerId: {
    type: DataTypes.TEXT,
    allowNull: false,
    },
    active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    },
    draft: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    },
    executiveStateId: {
      type: DataTypes.INTEGER,
      default: 1
    },
    adminStateId: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'tickets',
    timestamps: true, // Si no tienes columnas createdAt y updatedAt
  });
  return Ticket;
  };
  
  