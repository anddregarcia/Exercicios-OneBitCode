import mongoose from 'mongoose';

const MarketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  address: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Address',
    required: false 
  }
});

export default mongoose.model('Market', MarketSchema, 'market');