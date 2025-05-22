import mongoose from 'mongoose';

const ShopSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now, required: true},
    market: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Market',
      required: true 
    }
});

export default mongoose.model('Shop', ShopSchema, 'shop');