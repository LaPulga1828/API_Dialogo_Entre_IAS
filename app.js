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
