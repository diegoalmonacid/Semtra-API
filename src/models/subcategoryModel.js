// models/category.js
export default (sequelize, DataTypes) => {
    const Subcategory = sequelize.define('Subcategory', {
      subcategoryId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true, // Sequelize maneja las secuencias automáticamente
      },
      categoryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'subcategories',
      timestamps: false, // Si no tienes columnas createdAt y updatedAt
    });
    return Subcategory;
  };
  