

export default (sequelize, DataTypes) => {
    const Expenses = sequelize.define('Expenses', {
      expenseId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      ticketId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      subcategoryId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      docNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      partnerPayment: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      unitPrice: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      doctorName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      patientPartnerRelationship: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      adminStateId: {
        type: DataTypes.INTEGER,
      },
      executiveStateId: {
        type: DataTypes.INTEGER,
        default: 1,
      },
      draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      executiveComments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payment: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    }, {
      tableName: 'expenses',
      timestamps: true,
    });
    return Expenses;
  };