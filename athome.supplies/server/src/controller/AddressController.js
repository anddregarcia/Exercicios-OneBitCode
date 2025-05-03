import Address from '../schema/AddressSchema.js';

export async function createAddress(req, res) {
  try {
    const address = new Address(req.body);
    await address.save();
    return res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar endereço' });
  }
}