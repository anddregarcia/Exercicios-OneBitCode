import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
    code: {type: String},
    name: {type: String, required: true},
    isVegan: {type: Boolean}
});

export default mongoose.model('Brand', BrandSchema, 'brand');