
export default (sequelize, DataTypes) => {
    const CorrectionResponse = sequelize.define('CorrectionResponse', {
      responseId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      requestId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      expenseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
      },
    }, {
      tableName: 'correctionresponses',
      timestamps: false,
    });
    return CorrectionResponse;
  };
  