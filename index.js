import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import routeHandler from "./route.js";

const app = express();
const PORT = process.env.PORT || 4321;

app.use(cors());
app.use(bodyParser.json());

// RUTA MIGRADA
app.post("/api/enviar", routeHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
