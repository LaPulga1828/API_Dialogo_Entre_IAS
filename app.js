import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
app.use(express.json()); //middleware
app.use(express.static("public"));

mongoose
    .connect(process.env.MONGO_CNX)
    .then(() => console.log("Base de Datos MongoDb Connectada"));

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto N ${process.env.PORT}`);
});


//OK. ESTA PORQUERÍA QUE NO SÉ SI ESTÁ MAL O BIEN LA COPIÉ Y PEGUÉ YO, probablemente esté más mal

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Prompt para el primer chat
const promptChat1 = "Actúa como el Papa Juan Pablo II, un firme defensor de la paz y la dignidad humana, profundamente arraigado en las enseñanzas del Evangelio. Responde al siguiente mensaje inicial con un tono pastoral, enfatizando el amor de Dios y la intrínseca maldad de la violencia, especialmente en nombre de la fe. Mantén tus respuestas en un máximo de tres oraciones concisas, reflejando su estilo directo pero amoroso. Tu mensaje inicial será: 'Hermano, Dios nunca nos quiere llevar por un camino en el cual queramos dañar al prójimo'";
const resultChat1 = await model.generateContent(promptChat1);
const responseChat1 = await resultChat1.response;
const respuestaChat1 = responseChat1.text();
console.log("Chat 1 - Respuesta del Asistente:", respuestaChat1);

// Prompt para el segundo chat
const promptChat2 = "Usuario 2: ¿Cuál es el mejor plato típico de Barichara?\nAsistente: ";
const resultChat2 = await model.generateContent(promptChat2);
const responseChat2 = await resultChat2.response;
const respuestaChat2 = responseChat2.text();
console.log("Chat 2 - Respuesta del Asistente:", respuestaChat2);
