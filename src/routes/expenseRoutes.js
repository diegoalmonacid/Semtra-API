import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { isLoggedIn } from '../services/auth.js'; // Adjust the path as necessary
import { justAdmin, justInspector } from '../middleware/permissions.js'; // Adjust the path as necessary

const router = express.Router();

// Apply login middleware to all expense routes
router.use(isLoggedIn);
// Create a new expense
router.post('/crud', expenseController.createExpense);

//router.get('/crud/:id', expenseController.getExpenseById);
// Get a single expense by ID

// Get all expenses (admin only)
router.get('/crud', expenseController.getAllExpenses);

// Update an expense by ID
router.put('/crud', expenseController.updateExpense);

// Delete an expense by ID
router.delete('/crud', expenseController.deleteExpense);

// Accept an expense (inspector only)
router.put('/action/accept', justInspector, expenseController.acceptExpense);

// Send a correction for an expense (inspector only)
router.post('/action/sendCorrection', justInspector, expenseController.sendCorrection);

// Send a correction response for an expense
router.post('/action/sendCorrectionResponse', expenseController.sendCorrectionResponse);

// Upload a doc for an expense
router.post('/action/uploadDoc', expenseController.uploadDoc);

// Decline an expense (inspector only)
router.put('/action/decline', justInspector, expenseController.declineExpense);

router.get('/categories', expenseController.getCategories);
router.get('/subcategories', expenseController.getSubcategories);

export default router;