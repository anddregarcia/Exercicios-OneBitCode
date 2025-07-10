import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    street: {type: String, required: true},
    number: String,
    neighborhood: String,
    city: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'City',
            required: false 
          }
});

export default mongoose.model('Address', AddressSchema, 'address');