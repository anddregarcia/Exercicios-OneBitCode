import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema({
    code: {type: String, required: true},
    name: {type: String, required: true}
});

export default mongoose.model('Country', CountrySchema, 'country');