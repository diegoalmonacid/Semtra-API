import { createAdmin } from "../controllers/adminController.js"
import { createExecutive } from "../controllers/executiveController.js"
import { createPartner } from "../controllers/partnerController.js"

export default {
    "diego.almonacidv@usm.cl": createPartner,
    "diego.almonacidv@outlook.com": createAdmin,
    "diego.almonacid.temporal@outlook.com": createExecutive
}

