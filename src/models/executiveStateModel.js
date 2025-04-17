export default (sequelize, DataTypes) => {
    const ExecutiveState = sequelize.define('ExecutiveState', {
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
        tableName: 'executiveStates',
        timestamps: false
    });
    return ExecutiveState;
};