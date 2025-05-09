import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
    remitente: { type: String, required: true },
    contenido: { type: String, required: true },
    mensajes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversacion",
        required: true,
    },
    tiempo: { type: Date, default: Date.now },
});

export default mongoose.model("Mensaje", mensajeSchema);
