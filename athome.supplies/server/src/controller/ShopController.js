import Shop from '../schema/ShopSchema.js';

export async function createShop(req, res) {
  try {
    const shop = new Shop(req.body);
    await shop.save();
    return res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar compra' });
  }
}

export const getShop = async (req, res) => {
  try {
    const shop = await Shop.find().populate('market');
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
