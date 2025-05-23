import PantryProduct from '../schema/PantryProductSchema.js';

export async function createPantryProduct(req, res) {
  try {
    const pantryProduct = new PantryProduct(req.body);
    await pantryProduct.save();
    return res.status(201).json(pantryProduct);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar produto na prateleira' });
  }
}

export const getPantryProduct = async (req, res) => {
  try {
    const pantryProduct = await PantryProduct.find().populate('pantry').populate('product');
    res.json(pantryProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
