import State from '../schema/StateSchema.js';

export async function createState(req, res) {
  try {
    const state = new State(req.body);
    await state.save();
    return res.status(201).json(state);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar estado' });
  }
}

export const getState = async (req, res) => {
  try {
    const states = await State.find().populate('country');
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
