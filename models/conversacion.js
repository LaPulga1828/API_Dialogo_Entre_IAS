import mongoose from "mongoose";

const conversacionSchema = new mongoose.Schema({
    papa1Prompt: { type: String, required: true },
    terrorista2Prompt: { type: String, required: true },
    mensajes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mensanje",
        required: true,
    },
    tiempo: { type: Date, default: Date.now },
});

export default mongoose.model("Conversacion", conversacionSchema);
