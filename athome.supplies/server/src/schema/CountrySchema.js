import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema({
    code: {type: String},
    name: {type: String, required: true}
});

export default mongoose.model('Country', CountrySchema, 'country');