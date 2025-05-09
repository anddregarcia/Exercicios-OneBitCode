import Category from '../schema/CategorySchema.js';

export async function createCategory(req, res) {
  try {
    const category = new Category(req.body);
    await category.save();
    return res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar categoria' });
  }
}

export const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
