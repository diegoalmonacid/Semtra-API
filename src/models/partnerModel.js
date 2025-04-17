// models/partner.js
export default (sequelize, DataTypes) => {
    const Partner = sequelize.define('Partner', {
      partnerId: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      insuranceIsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      insuranceValidity: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      complementaryInsuranceId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      healtInsuranceId: {
        type: DataTypes.BIGINT,
      },
      arancel: {
        type: DataTypes.JSON,
        allowNull: true,
      }
    }, {
      tableName: 'partners',
      timestamps: false,
    });
    return Partner;
  };
  