// routes/partnerRoutes.js
import express from 'express'
const router = express.Router();
import {getAllPartners, getPartnerById, updatePartner, deletePartner} from '../controllers/partnerController.js'

router.get('/crud', getAllPartners);
router.put('/crud', updatePartner);
router.delete('/crud', deletePartner);
export default router;
