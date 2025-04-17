import { sendEmail } from '../services/email.js';
import { User, Ticket, AdminState, ExecutiveState } from '../models/index.js';

const ticketHook = async (ticket, options) => {
    console.log("ticket hook")
    // const adminPrevStateId = ticket.previous('adminStateId')
    const executivePrevStateId = ticket.previous('executiveStateId')
    // const adminPrevState = await AdminState.findByPk(adminPrevStateId);
    const executivePrevState = await ExecutiveState.findByPk(executivePrevStateId);
    // const adminStateChanged = `${adminPrevStateId}` !== `${ticket.adminStateId}`;
    const executiveStateChanged = `${executivePrevStateId}` !== `${ticket.executiveStateId}`; 
    if (executiveStateChanged) {
        try {
            // Fetch the user associated with the expense
            const user = await User.findOne({
                where: { userId: ticket.partnerId }
            });
            const executiveState = await ticket.getExecutiveState();
            const adminState = await ticket.getAdminState();
            // const prevState = adminStateChanged ? adminPrevState.name : executivePrevState.name;
            const prevState = executivePrevState.name;
            //const stateChanger = adminStateChanged ? 'Administrador' : 'Ejecutivo';
            const stateChanger = 'Ejecutivo';
            const updatedState = executiveState.name;
            //const updatedState = adminStateChanged ? adminState.name : executiveState.name;
            // const description = adminStateChanged ? adminState.description : executiveState.description;
            const description = executiveState.description;
            if (user) {
                // Send email notification
                const subject = 'Notificación de cambio de estado en su solicitud';
                const text = `Estimado ${user.displayName},\n\nEl estado de su solicitud con ID ${ticket.ticketId} ha sido cambiado por un ${stateChanger} de "${prevState}" a "${updatedState}". Esto significa que ${description}.\n\nSaludos cordiales,\n El equipo de SEMTRA-2`;
                sendEmail(user.email, subject, text);
                console.log('Email sent successfully');
            } else {
                console.error('User not found for the given expense');
            }
        } catch (error) {
            console.error('Error in expense hook: ', error);
        }
    }
};

export default ticketHook;