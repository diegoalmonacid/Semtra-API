import { Admin, Inspector } from '../models/index.js'
import { User } from '../models/index.js'


async function createAdmin(user) {
    const inspector = await Inspector.upsert({
        inspectorId: user.userId
    })
    const admin = await Admin.upsert({
        adminId: user.userId
    })
}

async function getAllAdmins(req, res) {
    try {
        const admins = await Admin.findAll({include: User});
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching admins.' });
    }
}

export {
    createAdmin,
    getAllAdmins
}