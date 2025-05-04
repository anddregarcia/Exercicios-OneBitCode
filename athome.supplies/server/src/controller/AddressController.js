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

export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
