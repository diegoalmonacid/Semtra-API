import getUserRole from "../services/getUserRole.js"


export const justAdmin = async (req, res, next) => {
    const role = await getUserRole(req.user.userId);
    if (role === 'admin') {
        next();
    } else {
        res.status(403).json( { message: 'Unauthorized' } );
    }
}

export const justPartner = async (req, res, next) => {
    const role = await getUserRole(req.user.userId);
    if (role === 'partner') {
        next();
    } else {
        res.status(403).json( { message: 'Unauthorized' } );
    }
}

export const justInspector = async (req, res, next) => {
    const role = await getUserRole(req.user.userId);
    if (role === 'admin' || role === 'executive') {
        next();
    } else {
        res.status(403).json( { message: 'Unauthorized' } );
    }
}