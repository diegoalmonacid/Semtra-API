export default (sequelize, DataTypes) => {
    const Executive = sequelize.define('Executive', {
      executiveId: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
    }, {
      tableName: 'executives',
      timestamps: false,
    });
    return Executive;
  };
  