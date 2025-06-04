import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chatrutas from './routes/chatrutas.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/chat', chatrutas);


// Conexión a MongoDB
mongoose.connect(process.env.MONGO_CNX)
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
}).catch(err => console.error('❌ Error al conectar a MongoDB:', err));
