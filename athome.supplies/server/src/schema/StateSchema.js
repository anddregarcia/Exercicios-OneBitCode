import mongoose from 'mongoose';

const StateSchema = new mongoose.Schema({
    code: {type: String, required: true},
    name: {type: String, required: true},
    country: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Country',
        required: true 
      }
});

export default mongoose.model('State', StateSchema, 'state');