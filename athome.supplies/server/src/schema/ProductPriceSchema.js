import mongoose from 'mongoose';

const ProductPriceSchema = new mongoose.Schema({
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true 
    },
    shop: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Shop',
      required: true 
    },
    value: {type: Number, required: true},
    quantity: {type: Number, required: true},
    date: {type: Date, required: true}
});

export default mongoose.model('ProductPrice', ProductPriceSchema, 'productPrice');