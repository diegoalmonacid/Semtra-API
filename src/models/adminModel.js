export default (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
      adminId: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
    }, {
      tableName: 'admins',
      timestamps: false,
    });
    return Admin;
  };
  