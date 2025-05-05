import City from '../schema/CitySchema.js';

export async function createCity(req, res) {
  try {
    const city = new City(req.body);
    await city.save();
    return res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar cidade' });
  }
}

export const getCity = async (req, res) => {
  try {
    const city = await City.find().populate('state');
    res.json(city);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
