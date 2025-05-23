import Pantry from '../schema/PantrySchema.js';

export async function createPantry(req, res) {
  try {
    const pantry = new Pantry(req.body);
    await pantry.save();
    return res.status(201).json(pantry);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar prateleira' });
  }
}

export const getPantry = async (req, res) => {
  try {
    const pantry = await Pantry.find();
    res.json(pantry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
