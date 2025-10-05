import mongoose from 'mongoose';

const StateSchema = new mongoose.Schema({
    code: {type: String},
    name: {type: String, required: true},
    country: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Country',
        required: false 
      }
});

export default mongoose.model('State', StateSchema, 'state');