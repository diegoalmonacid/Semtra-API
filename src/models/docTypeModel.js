// models/docTypeModel.js
export default (sequelize, DataTypes) => {
    const DocType = sequelize.define('DocType', {
        docTypeId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        tableName: 'doctypes',
        timestamps: false,
    });
    return DocType;
};