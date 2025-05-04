import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import addressRoutes from './src/routes/AddressRoutes.js';
import marketRoutes from './src/routes/marketRoutes.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'  // URL do seu frontend
}));

app.use(express.json());

app.use('/api/address', addressRoutes);
app.use('/api/market', marketRoutes);

const PORT = process.env.PORT || 3001

mongoose.connect('mongodb+srv://anddregarcia:andre0108@athome.lrtmo4u.mongodb.net/supplies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(err => console.error('Erro ao conectar ao MongoDB:', err));



