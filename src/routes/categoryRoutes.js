// routes/categoryRoutes.js
import express from 'express'
const router = express.Router();
import categoryController from '../controllers/categoryController.js';

router.get('/', categoryController.getAllCategories);
router.get('/docs', categoryController.getCategoryDocs);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;