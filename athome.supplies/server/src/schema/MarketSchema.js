import mongoose from 'mongoose';

const MarketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Address',
    required: true 
  }
});

export default mongoose.model('Market', MarketSchema, 'market');