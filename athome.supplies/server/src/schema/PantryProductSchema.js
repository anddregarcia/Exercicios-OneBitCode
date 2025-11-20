import mongoose from 'mongoose';

const PantryProductSchema = new mongoose.Schema({
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true 
    },
    pantry: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Pantry',
      required: true 
    },
    quantity: {type: Number, required: false},
    mustHave: {type: Boolean}
});

export default mongoose.model('PantryProduct', PantryProductSchema, 'pantryProduct');