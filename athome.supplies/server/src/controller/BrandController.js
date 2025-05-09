import Brand from '../schema/BrandSchema.js';

export async function createBrand(req, res) {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    return res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar marca' });
  }
}

export const getBrand = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
