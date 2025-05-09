import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    code: {type: String, required: true},
    name: {type: String, required: true}
});

export default mongoose.model('Category', CategorySchema, 'category');