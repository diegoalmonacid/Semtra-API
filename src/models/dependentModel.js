// models/partner.js
export default (sequelize, DataTypes) => {
    const Dependent = sequelize.define('Dependent', {
      dependentsId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      partnerId: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      renewal: {
        type: DataTypes.DATE,
      },
    }, {
      tableName: 'dependents',
      timestamps: false,
    });
    return Dependent;
  };
  