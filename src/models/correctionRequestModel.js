// models/partner.js
export default (sequelize, DataTypes) => {
    const CorrectionRequest = sequelize.define('CorrectionRequest', {
      requestId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      inspectorId: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expenseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("DATE_TRUNC('MONTH', CURRENT_DATE) + INTERVAL '1 MONTH' - INTERVAL '1 DAY'"),
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      corrected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      tableName: 'correctionrequests',
      timestamps: false,
    });
    return CorrectionRequest;
  };
  