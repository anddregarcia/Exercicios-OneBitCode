import mongoose from 'mongoose';

const UnitMeasurementSchema = new mongoose.Schema({
    code: {type: String, required: true},
    name: {type: String, required: true}
});

export default mongoose.model('UnitMeasurement', UnitMeasurementSchema, 'unitMeasurement');