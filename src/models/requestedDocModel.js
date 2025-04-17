export default (sequelize, DataTypes) => {
    const RequestedDoc = sequelize.define('RequestedDoc', {
      requestedDocsId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      docTypeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    }, {
      tableName: 'requesteddocs',
      timestamps: false,
    });
    return RequestedDoc;
  };