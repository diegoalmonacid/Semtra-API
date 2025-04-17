// controllers/partnerController.js
import { Partner, User, ComplementaryInsurance,
  HealthInsurance
 } from '../models/index.js'

async function createPartner(user) {
  const partner = await Partner.upsert({
    partnerId: user.userId,
    insuranceIsActive: false,
    insuranceValidity: new Date(),
    complementaryInsurance: null
  })
}



const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll({
      where: req.query,
      include:[ 
        {
          model: User,
          attributes: ['displayName', 'email' ]
        },
        {
          model: ComplementaryInsurance,
        },
        {
          model: HealthInsurance,
        }
      ]
    });
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePartner = async (req, res) => {
  try {
    const [updated] = await Partner.update(req.body, {
      where: { partnerId: req.query.id },
    });
    if (updated) {
      const updatedPartner = await Partner.findByPk(req.params.id);
      res.json(updatedPartner);
    } else {
      res.status(404).json({ error: 'Socio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePartner = async (req, res) => {
  try {
    const deleted = await Partner.destroy({
      where: { partnerId: req.query.id },
    });
    if (deleted) {
      res.json({ message: 'Socio eliminado' });
    } else {
      res.status(404).json({ error: 'Socio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  deletePartner,
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner
}
