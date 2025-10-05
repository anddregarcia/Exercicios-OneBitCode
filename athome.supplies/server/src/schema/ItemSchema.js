import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
    code: {type: String},
    name: {type: String, required: true},
    category: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category',
            required: false 
          }
});

export default mongoose.model('Item', ItemSchema, 'item');