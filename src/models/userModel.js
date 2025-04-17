// models/partner.js
export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      userId: {
        type: DataTypes.TEXT,
        primaryKey: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      surname: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      alias: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      tableName: 'users',
      timestamps: false,
    });
    return User;
  };