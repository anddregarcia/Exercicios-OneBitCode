import Item from '../schema/ItemSchema.js';

export async function createItem(req, res) {
  try {
    const item = new Item(req.body);
    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar item' });
  }
}

export const getItem = async (req, res) => {
  try {
    const item = await Item.find().populate('category');
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
