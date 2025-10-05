import mongoose from 'mongoose';

const PantrySchema = new mongoose.Schema({
    code: {type: String},
    description: {type: String, required: true}
});

export default mongoose.model('Pantry', PantrySchema, 'pantry');