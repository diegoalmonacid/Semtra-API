
import { Ticket, User, Partner, 
Executive, sequelize, Expense, AdminState,
ExecutiveState, CorrectionRequest,
CorrectionResponse, Doc, DocType,
Event, Category, Subcategory } from '../models/index.js';
import {dateParser} from '../services/conditionsParser.js';
import getUserRole from '../services/getUserRole.js';
import ticketHook from '../hooks/ticketHook.js';
import { Op } from 'sequelize';
// GET /tickets/info/count
export const countTickets = async (req, res) => {
  try {
    var { groupBy, condition } = req.body;
    groupBy = groupBy + "Id";
    const dateCondition = dateParser(condition);
    const conditionKeys = Object.keys(condition);
    if (groupBy) {
      const result = await Ticket.findAll({
        where: {
          ...dateCondition,
          ...condition,
          draft: false,
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('Ticket.executiveId')), 'count'], ...conditionKeys],
        group: ["Executive.executiveId","Executive.User.userId", ...conditionKeys],
        include: {
          model: Executive,
          include:{
            model: User, 
          }
        },
      })
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /tickets/info/totalAmount
export const sumPrices = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (ticketId) {
      const ticket = await Ticket.findByPk(ticketId, {
        include: [
          {
            model: ExecutiveState,
            attributes: ['name']
          },
          {
            model: AdminState,
            attributes: ['name']
          }
        ]
      });

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      if (ticket.draft) {
        return res.status(400).json({ message: 'Ticket is still in draft' });
      }

      const result = await Expense.sum('partnerPayment', {
        where: { ticketId }
      });
      return res.status(200).json({ "result": result });
    } else {
      const tickets = await Ticket.findAll({
        where: { partnerId: req.user.userId, draft: false },
        include: [
          {
            model: Expense,
            attributes: []
          },
          {
            model: ExecutiveState,
            attributes: ['id', 'name']
          },
          {
            model: AdminState,
            attributes: ['id', 'name']
          }
        ],
        attributes: [
          'ticketId',
          [sequelize.fn('SUM', sequelize.col('Expenses.partnerPayment')), 'totalPartnerPayment'],
          [sequelize.fn('COUNT', sequelize.col('Expenses.expenseId')), 'expenseCount']
        ],
        group: ['Ticket.ticketId', 'ExecutiveState.id', 'ExecutiveState.name', 'AdminState.id', 'AdminState.name']
      });

      return res.status(200).json(tickets);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /tickets
export const getTickets = async (req, res) => {
  try {
    let { ticketId } = req.query;
    const draftValue = req.query.draft ? req.query.draft : false;
    let tickets = []
    if (!ticketId) {
      tickets = await Ticket.findAll({
        where: {partnerId: req.user.userId, draft: draftValue},
        include: [
          {
            model: ExecutiveState
          },
          {
            model: AdminState
          },
          {
            model: Executive,
            include: {
              model: User,
              attributes: ['displayName']
            }
          },
          {
            model: Partner,
            include: {
              model: User,
              attributes: ['displayName']
            }
          }
        ]
      });
    }else{
      ticketId = parseInt(ticketId);
      tickets = await Ticket.findByPk(ticketId);
    }
    res.json(tickets);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
// POST /tickets
export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({ partnerId: req.user.userId });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Change draft to false
export const sendTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    const ticket = await Ticket.findByPk(ticketId);
    const expenses = await Expense.findAll({
      where: { ticketId },
      include: [
        {
          model: Doc,
          attributes: ['docId', 'docTypeId']
        },
        {
          model: Category,
          include: {
            model: DocType,
            attributes: ['docTypeId', 'name']
          }
        }
      ]
    });

    for (const expense of expenses) {
      if (!expense.docNumber) {
        return res.status(400).json({ 
          message: `Expense with ID ${expense.expenseId} is missing required fields in the form.` 
        });
      }
      const requiredDocTypes = expense.Category?.DocTypes;
      const providedDocTypes = expense.Docs.map(doc => doc.docTypeId);
      const missingDocTypes = requiredDocTypes.filter(docType => !providedDocTypes.includes(docType.docTypeId));
      const missingDocTypesNames = missingDocTypes.map(docType => docType.name);
      console.log(missingDocTypes)
      if (missingDocTypes.length > 0) {
        return res.status(400).json({ 
          message: `Expense with ID ${expense.expenseId} is missing required documents.`,
          missingDocTypes: missingDocTypesNames
        });
      }
    }
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if(ticket.partnerId !== req.user.userId){
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // for(const expense of expenses){
    //   const condition = await checkExpense(expense);
    //   if(!condition){
    //     return res.status(400).json({ message: 'Some expenses are not completed' });
    //   }
    // }
    for(const expense of expenses){
      await expense.update({ draft: false });
    }

    await ticket.update({ draft: false });
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// DELETE /tickets/:id
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.query;
    const ticket = await Ticket.findByPk(id, { where: { partnerId: req.user.userId, draft: true } });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Destroy all dependencies first
    const expenses = await Expense.findAll({ where: { ticketId: id } });
    for (const expense of expenses) {
      const correctionRequests = await CorrectionRequest.findAll({ where: { expenseId: expense.expenseId } });
      for (const correctionRequest of correctionRequests) {
        await CorrectionResponse.destroy({ where: { requestId: correctionRequest.requestId } });
        await correctionRequest.destroy();
      }
      await Doc.destroy({ where: { expenseId: expense.expenseId } });
      await expense.destroy();
    }

    await Event.destroy({ where: { ticketId: id } });
    await ticket.destroy();
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//tickets/info/?limit=10&page=1
export const getTicketsInfo = async (req, res) => {
  
  var role = await getUserRole(req.user.userId);
  var condition = req.query ? req.query : {};
  delete condition.limit;
  delete condition.page;
  let notExecutiveStateId = condition.notExecutiveStateId;
  delete condition.notExecutiveStateId;
  if (notExecutiveStateId) {
    condition = {
      ...condition,
      executiveStateId: { [Op.not]: notExecutiveStateId }
    };
  }

  condition.draft = false;

  const dateCondition = dateParser(condition);
  condition = {...condition,...dateCondition};
  if (condition.executiveId==='isNull'){
    condition.executiveId = {[Op.is]: null};
  }

  if(role!='admin'){
    const idKey = role + 'Id';
    condition = {...condition, [idKey]: req.user.userId};
  }
  
  const { limit, page } = req.query;
  const pages = page && limit ? 
    { 
      limit: parseInt(limit), 
      page: (parseInt(page)-1)*parseInt(limit) 
    } : {};
  try{
    const tickets = await Ticket.findAndCountAll({...pages,
      where: condition,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Executive,
          include: {
            model: User,
            attributes: ['displayName'],
          },
          required: false
        },
        {
          model: Partner,
          attributes: ['partnerId'],
          include: {
            model: User,
            attributes: ['displayName'],
          },
          required: false
        },
        {
          model: ExecutiveState,
          attributes: ['name'],
        }
      ]
    });
    for(const row of tickets.rows){
      const count = await Ticket.count({
        where: { ticketId: row.ticketId },
        include: {
          where: { ticketId: row.ticketId },
          model: Expense,
          required: true,
          attributes: ['ticketId']
        }
      });
      row.dataValues.expensesCount = count;
    }
    res.status(200).json(tickets);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
  
};

//tickets/info/expenses
export const getTicketsExpenses = async (req, res) => {
  try {
    if(!req.query.ticketId){
      return res.status(401).json({ message: 'Unauthorized' });
    }
    var role = await getUserRole(req.user.userId);
    if(role!='admin'){
      const idKey = role + 'Id';
      const ticket = await Ticket.findByPk(req.query.ticketId,
        {
          where: { [idKey]: req.user.userId },
          include: {
            model: Expense,
            required: true,
            include: [{
              model: Category
            },
            {
              model: Subcategory
            },
            {
              model: Doc,
              include: {
                model: DocType
              }
            },
            {
              model: ExecutiveState
            }
          ]
        }});
        //console.log("aksjnd")
      return res.status(200).json(ticket);
    }else{
      const ticket = await Ticket.findByPk(req.query.ticketId, {
        include: {
          model: Expense,
          required: true
        } 
      });
      return res.status(200).json(ticket);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
}

// ---------------------- HOOKS ----------------------

Ticket.addHook('afterUpdate', ticketHook);