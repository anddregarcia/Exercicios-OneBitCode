import Market from '../schema/MarketSchema.js';

export const createMarket = async (req, res) => {
  try {
    const market = new Market(req.body);
    await market.save();
    res.status(201).json(market);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMarket = async (req, res) => {
  try {
    const markets = await Market.find().populate('address');
    res.json(markets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};