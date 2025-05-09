import Product from '../schema/ProductSchema.js';

export async function createProduct(req, res) {
  try {
    const product = new Product(req.body);
    await product.save();
    return res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar produto' });
  }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.find().populate('brand').populate('item').populate('unitMeasurement');
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
