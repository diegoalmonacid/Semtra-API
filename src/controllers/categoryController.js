// controllers/categoryController.js
import { Category, DocType } from '../models/index.js';

const getAllCategories = async function(req, res){
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryDocs = async function(req, res){
  try {
    //console.log("aksjdn")
    const category = await Category.findByPk(req.query.categoryId, {
      include: DocType
    });
    const requestedDocs = category.DocTypes.reduce((acc, docType) => {
      acc.push({docTypeId: docType.docTypeId, name: docType.name})
      return acc
    }, [])
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    const {categoryId, name} = category;
    res.status(200).json({categoryId:categoryId, name:name, requestedDocs: requestedDocs});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async function(req, res){
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message, "reqBody":req.headers });
  }
};

const updateCategory = async function(req, res){
  try {
    const [updated] = await Category.update(req.body, {
      where: { categoryId: req.params.id },
    });
    if (updated) {
      const updatedCategory = await Category.findByPk(req.params.id);
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async function(req, res){
  try {
    const deleted = await Category.destroy({
      where: { categoryId: req.params.id },
    });
    if (deleted) {
      res.json({ message: 'Categoría eliminada' });
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryDocs,
  createCategory
}