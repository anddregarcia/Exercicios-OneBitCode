import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    street: {type: String, required: true},
    number: String,
    neighborhood: String,
    city: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, required: true}
});

export default mongoose.model('Address', AddressSchema);