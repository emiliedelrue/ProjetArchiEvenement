import Evenement from '../models/Evenement.js';

const createEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.create(req.body);
    res.status(201).json(evenement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllEvenements = async (req, res) => {
  try {
    const evenements = await Evenement.findAll();
    res.status(200).json(evenements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEvenementById = async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id);
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    res.status(200).json(evenement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id);
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    await evenement.update(req.body);
    res.status(200).json(evenement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id);
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    await evenement.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createEvenement,
  getAllEvenements,
  getEvenementById,
  updateEvenement,
  deleteEvenement
};
