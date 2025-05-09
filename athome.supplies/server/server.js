import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import cityRoutes from './src/routes/CityRoutes.js';
import stateRoutes from './src/routes/StateRoutes.js';
import countryRoutes from './src/routes/CountryRoutes.js';
import addressRoutes from './src/routes/AddressRoutes.js';
import marketRoutes from './src/routes/MarketRoutes.js';
import brandRoutes from './src/routes/BrandRoutes.js';
import unitMeasurementRoutes from './src/routes/UnitMeasurementRoutes.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'  // URL do seu frontend
}));

app.use(express.json());

app.use('/api/city', cityRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/country', countryRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/unitMeasurement', unitMeasurementRoutes);

const PORT = process.env.PORT || 3001

mongoose.connect('mongodb+srv://anddregarcia:andre0108@athome.lrtmo4u.mongodb.net/supplies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(err => console.error('Erro ao conectar ao MongoDB:', err));



