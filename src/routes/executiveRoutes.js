import express from 'express'
import * as ExecutiveController from '../controllers/executiveController.js';
import { isLoggedIn } from '../services/auth.js';
import { justAdmin } from '../middleware/permissions.js';
const router = express.Router();
router.use(isLoggedIn)

router.get('/', ExecutiveController.getExecutives);
router.get('/:id', ExecutiveController.getExecutiveById);
router.put('/:id', ExecutiveController.updateExecutive);
router.delete('/:id', ExecutiveController.deleteExecutive);
router.put('/action/assignTickets', justAdmin, ExecutiveController.assignTickets);
router.put('/action/transferTickets', justAdmin, ExecutiveController.transferTickets);
router.delete('/action/removeTickets', justAdmin, ExecutiveController.removeTickets);

export default router;