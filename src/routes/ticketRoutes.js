import express from 'express';
import * as ticketController from '../controllers/ticketController.js';
import { isLoggedIn } from '../services/auth.js';
import { justPartner, justAdmin } from '../middleware/permissions.js';
const router = express.Router();
router.use(isLoggedIn);

router.post('/crud', justPartner, ticketController.createTicket);
router.get('/crud', ticketController.getTickets);
router.delete('/crud', justPartner, ticketController.deleteTicket);
router.put('/action/send/', justPartner, ticketController.sendTicket);
router.get('/info/count', ticketController.countTickets);
router.get('/info/expenses', ticketController.getTicketsExpenses);
router.get('/info/totalAmount', ticketController.sumPrices);
router.get('/info', ticketController.getTicketsInfo);

export default router;