import { Expense, Category, Subcategory, Ticket, AdminState, ExecutiveState, Doc, DocType } from '../models/index.js';
import getUserRole from '../services/getUserRole.js';
import { CorrectionRequest, CorrectionResponse, sequelize } from '../models/index.js';
import updateTicketStatus from '../hooks/expenseHook.js';
import multer from 'multer';
import crypto from 'crypto';
import { containerClient, getBlobSasUri } from '../services/blobStorage.js';
import path from 'path';
// Create a new expense
export const createExpense = async (req, res) => {
    try {
        //console.log(req.body)
        const ticket = await Ticket.findByPk(req.body.ticketId);
        if(!ticket.draft){
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        if(req.body.docNumber){
            const badExpense = await Expense.findOne({where: {docNumber: req.body.docNumber}})
            if(badExpense){
                return res.status(403).json({ error: 'Document number already exists' });
            }
        }
        const expense = await Expense.create({...req.body});
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all expenses
export const getAllExpenses = async (req, res) => {
    try {
        const filter = req.query;
        //console.log(filter)
        const expenses = await Expense.findAll({
            where: filter,
            include: [
                { model: Category, attributes: ['name'] },
                { model: Subcategory, attributes: ['name'] },
                { model: Ticket, attributes: ['ticketId'] },
                { model: AdminState, attributes: ['name'] },
                { model: ExecutiveState, attributes: ['name'] },
                { model: Doc, attributes: ['name', 'docTypeId'], 
                    include: { model: DocType, attributes: ['name'] } 
                }
            ]
        });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single expense by ID
export const getExpenseById = async (req, res) => {
    try {
        const expenseId = parseInt(req.params.id, 10);
        //console.log(expenseId)
        const expense = await Expense.findByPk(expenseId, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: Subcategory, attributes: ['name'],
                    include: { model: DocType },
                 },
                { model: Ticket, attributes: ['ticketId'] },
                { model: AdminState, attributes: ['name'] },
                { model: ExecutiveState, attributes: ['name'] },
                { model: Doc, attributes: ['name', 'docTypeId'], 
                    include: { model: DocType, attributes: ['name']} 
                },
            ]
       });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an expense by ID, called in draft state
export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.query.expenseId);
        const ticket = await expense.getTicket();
        if (!ticket.draft) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        const {categoryId, subcategoryId, docNumber, partnerPayment, date, description, quantity, unitPrice, doctorName, patientPartnerRelationship} = req.body;
        expense.update({
            categoryId:categoryId,
            subcategoryId:subcategoryId,
            docNumber:docNumber,
            partnerPayment:partnerPayment,
            date:date,
            description:description,
            quantity:quantity,
            unitPrice:unitPrice,
            doctorName:doctorName,
            patientPartnerRelationship:patientPartnerRelationship
        });
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an expense by ID
export const deleteExpense = async (req, res) => {
    try {
        const deletedDocs = await Doc.destroy({
            where: { expenseId: req.query.expenseId }
        });
        const deleted = await Expense.destroy({
            where: { expenseId: req.query.expenseId }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json("Expense deleted successfully");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Admin or executive accepts an expense
export const acceptExpense = async (req, res) => {
    try {
        const role = await getUserRole(req.user.userId);
        const {expenseId, comments, payment} = req.body;
        const expense = await Expense.findByPk(expenseId);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        if (role === 'admin') {
            // await Expense.update(
            //     { adminStateId: 2 },
            //     { where: { expenseId: expenseId }, individualHooks: true } 
            // );
        } else if (role === 'executive') {
            const ticket = await expense.getTicket();
            if (ticket.executiveId !== req.user.userId) {
                return res.status(403).json({ error: 'Unauthorized action' });
            }
            await Expense.update(
                { executiveStateId: 2, executiveComments: comments, payment},
                { where: { expenseId: expenseId }, individualHooks: true }
            );
        } else {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        const updatedExpense = await Expense.findByPk(expenseId,{
            include: [
                { model: Category, attributes: ['name'] },
                { model: Subcategory, attributes: ['name'] },
                { model: Ticket, attributes: ['ticketId'] },
                { model: AdminState, attributes: ['name'] },
                { model: ExecutiveState, attributes: ['name'] },
            ]
        });
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const sendCorrection = async (req, res) => {
    try {
        const role = await getUserRole(req.user.userId);
        const expense = await Expense.findByPk(req.body.expenseId);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        const transaction = await sequelize.transaction();
        const correctionRequest = await CorrectionRequest.create({
            inspectorId: req.user.userId,
            expenseId: req.body.expenseId,
            deadline: req.body.deadline,
            comment: req.body.comment,
            corrected: false
        }, { transaction });
        
        if (role === 'admin') {
            // await Expense.update(
            //     { adminStateId: 3 },
            //     { 
            //         where: { expenseId: req.body.expenseId } ,
            //         individualHooks: true,
            //     }
            // );
        } else if (role === 'executive' && expense.adminStateId === "2") {
            await Expense.update(
                { executiveStateId: 3 },
                { where: { expenseId: req.body.expenseId }, individualHooks: true }
            );
        } else {
            await transaction.rollback();
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        
        const updatedExpense = await Expense.findByPk(req.body.expenseId, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: Subcategory, attributes: ['name'] },
                { model: Ticket, attributes: ['ticketId'] },
                { model: AdminState, attributes: ['name'] },
                { model: ExecutiveState, attributes: ['name'] },
            ],
            transaction
        });
        
        await transaction.commit();
        res.status(201).json({ correctionRequest, updatedExpense });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const sendCorrectionResponse = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.body.expense.expenseId);
        const ticket = await expense.getTicket();
        const partner = await ticket.getPartner();
        const {categoryId, subcategoryId, docNumber, partnerPayment} = req.body.expense;
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        const transaction = await sequelize.transaction();
        const correctionRequest = await CorrectionRequest.findOne({
            where: { expenseId: req.body.expense.expenseId, corrected: false },
            transaction
        });
        const role = await getUserRole(correctionRequest.inspectorId);
        if (!correctionRequest) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Correction request not found' });
        }
        if (partner.partnerId !== req.user.userId) {
            await transaction.rollback();
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        await correctionRequest.update( { corrected: true } , { transaction });
        const correctionResponse = await CorrectionResponse.create({
            inspectorId: correctionRequest.inspectorId,
            expenseId: req.body.expense.expenseId,
            comment: req.body.comment,
            requestId: correctionRequest.requestId,
        }, { transaction });
        
        if (role === 'admin') {
            await Expense.update(
                { 
                    categoryId,
                    subcategoryId,
                    docNumber,
                    partnerPayment,
                    adminStateId: 4,
                },
                { where: { expenseId: req.body.expense.expenseId }, individualHooks: true },
                { transaction }
            );
        } else if (role === 'executive' && expense.adminStateId === "2") {
            await Expense.update(
                { 
                    categoryId,
                    subcategoryId,
                    docNumber,
                    partnerPayment,
                    executiveStateId: 4,
                },
                { where: { expenseId: req.body.expense.expenseId }, individualHooks: true },
                { transaction }
            );
        } else {
            await transaction.rollback();
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        const updatedExpense = await Expense.findByPk(req.body.expense.expenseId, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: Subcategory, attributes: ['name'] },
                { model: Ticket, attributes: ['ticketId'] },
                { model: AdminState, attributes: ['name'] },
                { model: ExecutiveState, attributes: ['name'] },
            ],
            transaction
        });
        
        await transaction.commit();
        res.status(201).json({ correctionResponse, updatedExpense });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export const uploadDoc = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { expenseId, docTypeId } = req.body;
            const timestamp = Date.now();
            const blobName = crypto.randomBytes(16).toString('hex') + '-' + timestamp + '-' + req.file.originalname + path.extname(req.file.originalname);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const fileBuffer = req.file.buffer;
            await blockBlobClient.upload(fileBuffer, fileBuffer.length);
            const blobUrl = getBlobSasUri(blobName);

            const existingDoc = await Doc.findOne({ where: { expenseId, docTypeId } });
            if (existingDoc) {
                console.log(existingDoc.name)
                const existingBlobClient = containerClient.getBlockBlobClient(existingDoc.getDataValue('name'));
                await existingBlobClient.delete();
                await Doc.destroy({ where: { expenseId, docTypeId } });
            }

            await Doc.create({ expenseId, docTypeId, name: blobName });
            res.status(200).json({ message: "File uploaded successfully", url: blobUrl });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

export const declineExpense = async (req, res) => {
    try {
        const role = await getUserRole(req.user.userId);
        const {expenseId, comments} = req.body;
        const expense = await Expense.findByPk(expenseId);
        console.log("1")
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        console.log("2")
        if (role === 'admin') {
            console.log("3")
            await Expense.update(
                { adminStateId: 5 },
                { where: { expenseId: expenseId }, individualHooks: true }
            );
        } else if (role === 'executive') {
            console.log("4")
            const ticket = await expense.getTicket();
            if (ticket.executiveId !== req.user.userId) {
                console.log("5")
                return res.status(403).json({ error: 'Unauthorized action' });
            }
            await Expense.update(
                { executiveStateId: 5, executiveComments: comments },
                { where: { expenseId: expenseId }, individualHooks: true }
            );
        } else {
            console.log("6")
            //console.log(role, expense.adminStateId);
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        console.log("7")

        const updatedExpense = await Expense.findByPk(expenseId, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: Subcategory, attributes: ['name'] },
                { model: Ticket, attributes: ['ticketId'] },
                { model: AdminState, attributes: ['name'] },
                { model: ExecutiveState, attributes: ['name'] },
            ]
        });
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export async function getCategories(req, res) {
    try {
        const categories = await Category.findAll({
            include: [
                { model: Subcategory, attributes: ['name'] }
            ]
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getSubcategories(req, res) {
    try {
        const id = req.query.categoryId;
        if(!id){
            return res.status(400).json({ error: 'Category ID is required' });
        }
        const subcategories = await Subcategory.findAll({
            where: { categoryId: id }
        });
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// ---------------------- Hooks ----------------------
Expense.afterUpdate( (expense, options) => {
    updateTicketStatus(expense.ticketId, options);
});