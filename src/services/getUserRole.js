import { Partner, Executive, Admin } from '../models/index.js';

export default async (userId) => {
    const isPartner = await Partner.findOne({ where: { 'partnerId': userId } });
    if (isPartner) return 'partner';
  
    const isExecutive = await Executive.findOne({ where: { 'executiveId': userId } });
    if (isExecutive) return 'executive';
  
    const isAdmin = await Admin.findOne({ where: { 'adminId': userId } });
    if (isAdmin) return 'admin';
  
    return 'Unknown Role';
  };