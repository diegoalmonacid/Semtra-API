// models/category.js
export default (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      categoryId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true, // Sequelize maneja las secuencias automáticamente
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    }, {
      tableName: 'categories',
      timestamps: false, // Si no tienes columnas createdAt y updatedAt
    });
    return Category;
  };
  