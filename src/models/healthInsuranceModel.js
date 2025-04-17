// models/complementaryInsuranceModel.js
export default (sequelize, DataTypes) => {
    const HealthInsurance = sequelize.define('HealtInsurance', {
        healtInsuranceId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isapre:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        docTypeId: {
            type: DataTypes.BIGINT,
            allowNull: true,
        }
    }, {
        tableName: 'healtinsurances',
        timestamps: false,
    });
    return HealthInsurance;
};