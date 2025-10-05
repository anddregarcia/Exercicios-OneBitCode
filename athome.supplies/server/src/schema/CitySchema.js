import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema({
    code: {type: String},
    name: {type: String, required: true},
    state: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'State',
        required: false 
      }
});

export default mongoose.model('City', CitySchema, 'city');