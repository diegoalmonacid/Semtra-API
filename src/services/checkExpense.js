
export const checkExpense = async (expense) => {
    try{    
        if(expense.docNumber === null || expense.docNumber === ''){
            return false;
        }
        if(expense.partnerPayment === null){
            return false;
        }
        if(expense.subcategoryId===null || expense.categoryId===null){
            return false;
        }
        const subcategory = await expense.getSubcategory();
        const subcategoryDocTypes = await subcategory.getDocTypes();
        const subcategoryDocTypesIds = subcategoryDocTypes.map(docType => docType.docTypeId);
        const expenseDocs = await expense.getDocs();
        const expenseDocTypeIds = expenseDocs.map(doc => doc.docTypeId);
        const hasAllSubcategoryDocTypes = subcategoryDocTypesIds.every(docTypeId => expenseDocTypeIds.includes(docTypeId));

        const ticket = await expense.getTicket();
        const partner = await ticket.getPartner();
        const healthInsurance = await partner.getHealthInsurance();
        if(!healthInsurance){
            return true;
        }
        const healthDocTypes = await healthInsurance.getDocTypes();
        const healthDocTypeIds = healthDocTypes.map(docType => docType.docTypeId);
        const complementaryInsurance = await partner.getComplementaryInsurance();
        if(!healthInsurance){
            return true;
        }
        const complementaryDocTypes = await complementaryInsurance.getDocTypes();
        const complementaryDocTypeIds = complementaryDocTypes.map(docType => docType.docTypeId);
        const healthDocs = healthDocTypeIds.every(docTypeId => expenseDocTypeIds.includes(docTypeId));
        const complementaryDocs = complementaryDocTypeIds.every(docTypeId => expenseDocTypeIds.includes(docTypeId));
        return (hasAllSubcategoryDocTypes && healthDocs && complementaryDocs);
    }catch(error){
        console.error('Error checking expense:', error);
        return false;
    }
}