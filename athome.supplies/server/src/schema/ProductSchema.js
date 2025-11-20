import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    code: {type: String},
    name: {type: String, required: true},
    brand: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Brand',
      required: false 
    },
    volume: {type: Number, required: true},
    unitMeasurement: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'UnitMeasurement',
      required: false
    },
    item: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Item',
      required: false 
    },
    isVegan: {type: Boolean, required: false}
});

export default mongoose.model('Product', ProductSchema, 'product');