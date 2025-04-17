export default (sequelize, DataTypes) => {
    const Inspector = sequelize.define('Inspector', {
      inspectorId: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
    }, {
      tableName: 'inspectors',
      timestamps: false,
    });
    return Inspector;
  };
  