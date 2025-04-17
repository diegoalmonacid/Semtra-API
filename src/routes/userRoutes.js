import express from 'express'
import { isLoggedIn } from '../services/auth.js'
import getUserRole from '../services/getUserRole.js';

const router = express.Router();

router.get('/profile', isLoggedIn, async (req, res) => {
    const { userId, name, surname, email, displayName } = req.user;
    const userRole = await getUserRole(userId);
    res.send(JSON.stringify({
        userId: userId,
        name: name,
        surname: surname,
        email: email,
        displayName: displayName,
        role: userRole
    }));
});

export default router;