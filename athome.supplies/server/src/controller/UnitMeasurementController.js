import UnitMeasurement from '../schema/UnitMeasurementSchema.js';

export async function createUnitMeasurement(req, res) {
  try {
    const unitM = new UnitMeasurement(req.body);
    await unitM.save();
    return res.status(201).json(unitM);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar unidade de medida' });
  }
}

export const getUnitMeasurement = async (req, res) => {
  try {
    const unitM = await UnitMeasurement.find();
    res.json(unitM);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
