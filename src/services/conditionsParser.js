import {sequelize} from '../models/index.js';
import { Op } from 'sequelize';

const dateParser = (conditions) => {
    if (conditions.month && conditions.year) {
        var month = conditions.month;
        var year = conditions.year;
        delete conditions.month;
        delete conditions.year;
        return {
            [Op.and]: [
                sequelize.where(sequelize.fn('date_part', 'month', sequelize.col('createdAt')), month),
                sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('createdAt')), year)
            ]
        };
    }else{
        if(conditions.month){
            delete conditions.month;
        }
        if(conditions.year){
            delete conditions.year;
        }
        return {};
    }
};

export {dateParser}
