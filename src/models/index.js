// models/index.js
import Sequelize from 'sequelize';
import sequelize from '../config/db.js';
import categoryBuilder from './categoryModel.js'
import correctionResponseBuilder from './correctionResponseModel.js'
import dependentBuilder from './dependentModel.js'
import eventBuilder from './eventModel.js'
import executiveBuilder from './executiveModel.js'
import expenseBuilder from './expenseModel.js'
import partnerBuilder from './partnerModel.js'
import requestedDocBuilder from './requestedDocModel.js'
import subcategoryBuilder from './subcategoryModel.js'
import ticketBuilder from './ticketModel.js'
import correctionRequestBuilder from './correctionRequestModel.js'
import userBuilder from './userModel.js'
import inspectorBuilder from './inspectorModel.js';
import adminBuilder from './adminModel.js';
import adminStateBuilder from './adminStateModel.js';
import executiveStateBuilder from './executiveStateModel.js';
import docBuilder from './docsModel.js';
import docTypeBuilder from './docTypeModel.js';
import complementaryInsuranceModel from './complementaryInsuranceModel.js';
import healtInsuranceModel from './healthInsuranceModel.js';

const Category = categoryBuilder(sequelize, Sequelize);
const CorrectionRequest = correctionRequestBuilder(sequelize, Sequelize);
const CorrectionResponse = correctionResponseBuilder(sequelize, Sequelize);
const Dependent = dependentBuilder(sequelize, Sequelize);
const Event = eventBuilder(sequelize, Sequelize);
const Executive = executiveBuilder(sequelize, Sequelize);
const Expense = expenseBuilder(sequelize, Sequelize);
const Partner = partnerBuilder(sequelize, Sequelize);
const RequestedDoc = requestedDocBuilder(sequelize, Sequelize);
const Subcategory = subcategoryBuilder(sequelize, Sequelize);
const Ticket = ticketBuilder(sequelize, Sequelize);
const User = userBuilder(sequelize, Sequelize);
const Inspector = inspectorBuilder(sequelize, Sequelize);
const Admin = adminBuilder(sequelize, Sequelize);
const ExecutiveState = executiveStateBuilder(sequelize, Sequelize);
const AdminState = adminStateBuilder(sequelize, Sequelize);
const Doc = docBuilder(sequelize, Sequelize);
const DocType = docTypeBuilder(sequelize, Sequelize);
const ComplementaryInsurance = complementaryInsuranceModel(sequelize, Sequelize);
const HealthInsurance = healtInsuranceModel(sequelize, Sequelize);


// Definir asociaciones aquí

Category.hasMany(Subcategory, { foreignKey: 'categoryId' });// Category Subcategory
Subcategory.belongsTo(Category, { foreignKey: 'categoryId' });

Category.hasMany(Expense, { foreignKey: 'categoryId' });// Expense Category
Expense.belongsTo(Category, { foreignKey: 'categoryId' });


DocType.belongsToMany(Category, { through: RequestedDoc, foreignKey: 'docTypeId'});// Category DocType
Category.belongsToMany(DocType, { through: RequestedDoc, foreignKey: 'categoryId'});

Subcategory.hasMany(Expense, { foreignKey: 'subcategoryId' });// Expense Subcategory
Expense.belongsTo(Subcategory, { foreignKey: 'subcategoryId' });

Expense.belongsTo(Ticket, { foreignKey: 'ticketId' });// Ticket Expense
Ticket.hasMany(Expense, { foreignKey: 'ticketId' });

Expense.hasMany(CorrectionRequest, { foreignKey: 'expenseId' });// CRequest Expense
CorrectionRequest.belongsTo(Expense, { foreignKey: 'expenseId' });

Expense.hasMany(CorrectionResponse, { foreignKey: 'expenseId' });//CResponse Expense
CorrectionResponse.belongsTo(Expense, { foreignKey: 'expenseId' });

Ticket.belongsTo(Partner, { foreignKey: 'partnerId' });// Partner Ticket
Partner.hasMany(Ticket, { foreignKey: 'partnerId' });

Ticket.belongsTo(Executive, { foreignKey: 'executiveId' });// Executive Ticket
Executive.hasMany(Ticket, { foreignKey: 'executiveId' });

Ticket.hasMany(Event, { foreignKey: 'ticketId' });// Ticket Event
Event.belongsTo(Ticket, { foreignKey: 'ticketId' });

CorrectionRequest.belongsTo(Inspector, { foreignKey: 'inspectorId' });// Inspector CResponse
Inspector.hasMany(CorrectionRequest, { foreignKey: 'inspectorId' })

CorrectionResponse.belongsTo(Inspector, { foreignKey: 'inspectorId' });// Inspector CRequest
Inspector.hasMany(CorrectionRequest, { foreignKey: 'inspectorId' });

Partner.hasMany(Dependent, { foreignKey: 'partnerId' });//Dependents Partners
Dependent.belongsTo(Partner, { foreignKey: 'partnerId' });

Executive.belongsTo(Inspector, { foreignKey: 'executiveId' });//Inspector Executive
Inspector.hasOne(Executive, { foreignKey: 'executiveId' })
Executive.belongsTo(User, { foreignKey: 'executiveId' })// User Executive
User.hasOne(Executive, { foreignKey: 'executiveId' })

Partner.belongsTo(User, { foreignKey: 'partnerId' })// User Partner
User.hasOne(Partner, { foreignKey: 'partnerId' });

Admin.belongsTo(Inspector, { foreignKey: 'adminId' })// Inspector Admin
Inspector.hasOne(Admin, { foreignKey: 'adminId' })
Admin.belongsTo(User, { foreignKey: 'adminId' })// User Admin
User.hasOne(Admin, { foreignKey: 'adminId' })

Inspector.belongsTo(User, { foreignKey:'inspectorId' })// User Inspector
User.hasOne(Inspector, { foreignKey:'inspectorId' })

Expense.belongsTo(AdminState, { foreignKey: 'adminStateId' })// AdminState Expense
AdminState.hasMany(Expense, { foreignKey: 'id' })

Expense.belongsTo(ExecutiveState, { foreignKey: 'executiveStateId' })// ExecutiveState Expense
ExecutiveState.hasMany(Expense, { foreignKey: 'id' })

Ticket.belongsTo(AdminState, { foreignKey: 'adminStateId' })// AdminState Ticket
AdminState.hasMany(Ticket, { foreignKey: 'id' })

Ticket.belongsTo(ExecutiveState, { foreignKey: 'executiveStateId' })// ExecutiveState Ticket
ExecutiveState.hasMany(Ticket, { foreignKey: 'id' })

Doc.belongsTo(Expense, { foreignKey: 'expenseId' })// Docs Expense
Expense.hasMany(Doc, { foreignKey: 'expenseId' })

Doc.belongsTo(DocType, { foreignKey: 'docTypeId' })// Docs Expense
DocType.hasMany(Doc, { foreignKey: 'docTypeId' })

ComplementaryInsurance.hasMany(Partner, { foreignKey: 'complementaryInsuranceId' })// ComplementaryInsurance Partner
Partner.belongsTo(ComplementaryInsurance, { foreignKey: 'complementaryInsuranceId' })

ComplementaryInsurance.belongsTo(DocType, { foreignKey: 'docTypeId' })// ComplementaryInsurance DocType
DocType.hasOne(ComplementaryInsurance, { foreignKey: 'docTypeId' })

HealthInsurance.hasMany(Partner, { foreignKey: 'healtInsuranceId' })// HealthInsurance Partner
Partner.belongsTo(HealthInsurance, { foreignKey: 'healtInsuranceId' })

HealthInsurance.belongsTo(DocType, { foreignKey: 'docTypeId' })// HealthInsurance DocType
DocType.hasOne(HealthInsurance, { foreignKey: 'docTypeId' })


// Exportar los modelos
export {
  sequelize,
  Sequelize,
  Category,
  CorrectionRequest,
  CorrectionResponse,
  Dependent,
  Event,
  Executive,
  Expense,
  Partner,
  RequestedDoc,
  Subcategory,
  Ticket,
  User,
  Admin,
  Inspector,
  AdminState,
  ExecutiveState,
  Doc,
  DocType,
  ComplementaryInsurance,
  HealthInsurance
};
