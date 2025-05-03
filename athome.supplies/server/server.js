import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import addressRoutes from './src/routes/addressRoutes.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'  // URL do seu frontend
}));
app.use(express.json());
app.use('/api', addressRoutes);

const PORT = process.env.PORT || 3001

mongoose.connect('mongodb+srv://anddregarcia:andre0108@athome.lrtmo4u.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(err => console.error('Erro ao conectar ao MongoDB:', err));



