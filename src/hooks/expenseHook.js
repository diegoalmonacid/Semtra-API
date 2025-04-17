import { Expense, Ticket } from '../models/index.js';

export default async (ticketId, options) => {
    try {
      const expenses = await Expense.findAll({
        where: { ticketId },
        attributes: ['executiveStateId'],
        transaction: options.transaction,
      });

      console.log('TicketHook')
  
      //let adminStateId_ticket = 1;
      let executiveStateId_ticket = 1;
      
      if (expenses.filter(expense => expense.executiveStateId == 2).length >= 1) {
        executiveStateId_ticket = 2;
      }
      if (expenses.filter(expense => expense.executiveStateId == 3).length === expenses.length) {
        executiveStateId_ticket = 3;
      }
      

      // const adminStateCount = expenses.reduce((acc, expense) => {
      //   acc[expense.adminStateId] = (acc[expense.adminStateId] || 0) + 1;
      //   return acc;
      // }, {});
  
      // const executiveStateCount = expenses.reduce((acc, expense) => {
      //   acc[expense.executiveStateId] = (acc[expense.executiveStateId] || 0) + 1;
      //   return acc;
      // }, {});
  
      // if (adminStateCount[3] > 0) {
      //   adminStateId_ticket = 3;
      // } else if (adminStateCount[4] > 0) {
      //   adminStateId_ticket = 4;
      // } else if (adminStateCount[1] > 0) {
      //   adminStateId_ticket = 1;
      // }
  
      // if (executiveStateCount[3] > 0) {
      //   executiveStateId_ticket = 3;
      // } else if (executiveStateCount[4] > 0) {
      //   executiveStateId_ticket = 4;
      // } else if (executiveStateCount[1] > 0) {
      //   executiveStateId_ticket = 1;
      // }
  
      await Ticket.update(
        { //adminStateId: adminStateId_ticket,
          executiveStateId: executiveStateId_ticket,
        },
        { where: { ticketId }, transaction: options.transaction, individualHooks: true },
      );
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
};