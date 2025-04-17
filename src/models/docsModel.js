// models/docsModel.js
import {getBlobSasUri} from '../services/blobStorage.js';
export default (sequelize, DataTypes) => {
    const Docs = sequelize.define('Docs', {
        docId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        expenseId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            get(){
                const rawValue = this.getDataValue('name');
                const sasUri = getBlobSasUri(rawValue);
                return sasUri;
            }
        },
        docTypeId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    }, {
        tableName: 'docs',
        timestamps: false,
    });
    return Docs;
};
  