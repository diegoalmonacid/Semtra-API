// models/complementaryInsuranceModel.js
export default (sequelize, DataTypes) => {
    const ComplementaryInsurance = sequelize.define('ComplementaryInsurance', {
        complementaryInsuranceId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        docTypeId: {
            type: DataTypes.BIGINT,
            allowNull: true,
        }
    }, {
        tableName: 'complementaryinsurances',
        timestamps: false,
    });
    return ComplementaryInsurance;
};