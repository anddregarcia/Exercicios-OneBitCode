import ProductPrice from '../schema/ProductPriceSchema.js';

export async function createProductPrice(req, res) {
  try {
    const productPrice = new ProductPrice(req.body);
    await productPrice.save();
    return res.status(201).json(productPrice);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar produto' });
  }
}

export const getProductPrice = async (req, res) => {
  try {
    const productPrice = await ProductPrice.find().populate('shop').populate('product');
    res.json(productPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
