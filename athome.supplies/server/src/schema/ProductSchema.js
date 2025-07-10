import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    code: {type: String, required: true},
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
      required: true 
    },
    item: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Item',
      required: false 
    },
    isVegan: {type: Boolean, required: true}
});

export default mongoose.model('Product', ProductSchema, 'product');