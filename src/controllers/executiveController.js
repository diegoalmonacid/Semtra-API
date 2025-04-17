import { Executive, Inspector, User, Category, Subcategory } from '../models/index.js'
import { Ticket } from '../models/index.js'


async function createExecutive(user) {
    const inspector = await Inspector.upsert({
        inspectorId: user.userId
    })
    const executive = await Executive.upsert({
        executiveId: user.userId
    })
}

async function getExecutives(req, res) {
    try {

        const executives = await Executive.findAll({ 
            where: req.query,
            include: {
                model: User,
                attributes: ['userId', 'displayName'],
            } 
        });
        res.status(200).json(executives);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function getExecutiveById(req, res) {
    try {
        const executive = await Executive.findByPk(req.params.id);
        if (executive) {
            res.status(200).json(executive);
        } else {
            res.status(404).json({ message: 'Executive not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateExecutive(req, res) {
    try {
        const [updated] = await Executive.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedExecutive = await Executive.findByPk(req.params.id);
            res.status(200).json(updatedExecutive);
        } else {
            res.status(404).json({ message: 'Executive not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteExecutive(req, res) {
    try {
        const deleted = await Executive.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'Executive deleted' });
        } else {
            res.status(404).json({ message: 'Executive not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function assignTickets(req, res) {
    const transaction = await Ticket.sequelize.transaction();

    try {
        var { executiveId, tickets, notify } = req.body;

        // Check if any ticket already has an executiveId assigned
        for (const ticketElement of tickets) {
            const ticket = await Ticket.findOne({
                where: { ticketId: ticketElement.ticketId },
                transaction
            });
            if (ticket && ticket.executiveId !== null) {
                throw new Error(`Ticket ${ticketElement.ticketId} is already assigned to an executive`);
            }
        }

        // Assign tickets to the executiveId
        for (const ticketElement of tickets) {
            await Ticket.update(
                { 
                    executiveId: executiveId
                },
                { where: { ticketId: ticketElement.ticketId },
                transaction,
                individualHooks: notify 
                }
            );
        }

        await transaction.commit();
        res.status(200).json({ message: 'Tickets assigned' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
        throw new Error(error.message);
    }
}

//executives/action/transferTickets
/* This function receive req.fromExecutiveId, req.toExecutiveId 
and req.tickets[].ticketId. The goal is transfer tickets from 
one executive to another, ie delete tickets from fromExecutive and
add them to toExecutive. If the process fails, don't save the transaction.*/

async function transferTickets(req, res) {
    const { fromExecutiveId, toExecutiveId, tickets } = req.body;
    const transaction = await Ticket.sequelize.transaction();

    try {
        // Check if all tickets belong to fromExecutiveId
        for (const ticketElement of tickets) {
            const ticket = await Ticket.findOne({
                where: { ticketId: ticketElement.ticketId, executiveId: fromExecutiveId },
                transaction
            });
            if (!ticket) {
                throw new Error(`Ticket ${ticketElement.ticketId} does not belong to executive ${fromExecutiveId}`);
            }
        }

        // Transfer tickets to toExecutiveId
        for (const ticketElement of tickets) {
            await Ticket.update(
                { executiveId: toExecutiveId },
                { where: { ticketId: ticketElement.ticketId }, transaction }
            );
        }

        await transaction.commit();
        res.status(200).json({ message: 'Tickets transferred' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
}

/* remove all req.tickets[].ticketId from req.executiveId, 
only if all tickets belongs to that executive */
async function removeTickets(req, res) {
    const transaction = await Ticket.sequelize.transaction();
    try {
        const { executiveId, tickets, notify } = req.body;
        // Check if all tickets belong to executiveId
        for (const ticketElement of tickets) {
            const ticket = await Ticket.findOne({
                where: { ticketId: ticketElement.ticketId, executiveId },
                transaction,
            });
            if (!ticket) {
                throw new Error(`Ticket ${ticketElement.ticketId} does not belong to executive ${executiveId}`);
            }
        }

        // Remove tickets from executiveId
        for (const ticketElement of tickets) {
            await Ticket.update(
                { 
                    executiveId: null,
                    //adminStateId: 7,
                },
                { 
                    where: { ticketId: ticketElement.ticketId },
                    transaction,
                    individualHooks: notify
                }
            );
        }

        await transaction.commit();
        res.status(200).json({ message: 'Tickets removed' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
}



export {
    createExecutive,
    getExecutives,
    getExecutiveById,
    updateExecutive,
    deleteExecutive,
    assignTickets,
    transferTickets,
    removeTickets
}