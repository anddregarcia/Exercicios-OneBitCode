import Country from '../schema/CountrySchema.js';

export async function createCountry(req, res) {
  try {
    const country = new Country(req.body);
    await country.save();
    return res.status(201).json(country);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar país' });
  }
}

export const getCountry = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
