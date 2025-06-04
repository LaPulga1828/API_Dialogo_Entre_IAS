import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
  autor: {
    type: String,
    enum: ['Papa', 'Terrorista'],
    required: true
  },
  contenido: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Mensaje', mensajeSchema);

