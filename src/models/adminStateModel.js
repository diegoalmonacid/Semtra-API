export default (sequelize, DataTypes) => {
    const AdminState = sequelize.define('AdminState', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'adminStates',
        timestamps: false
    });
    return AdminState;
};