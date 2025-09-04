const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());

// Conexión con mongo
const uri = "mongodb+srv://Alejandro:y1zajqr9AWm4Gl5g@cluster0.pij2euq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function getAlarmas() {
  await client.connect();
  const database = client.db("Arqui1");
  const alarmas = database.collection("Alarmas");

  return alarmas.find().sort({ fecha: 1 }).limit(50).toArray();
}

// ENDPOINTS
app.get("/api/alarmas", async (req, res) => {
  try {
    const data = await getAlarmas();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener datos");
  }
});

app.get("/api/entrada", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Arqui1");
    const movs = database.collection("Entrada");
    const data = await movs.find().sort({ ts: 1 }).limit(50).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener datos");
  }
});

app.get("/api/cuartos", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Arqui1");
    const cuartos = database.collection("Iluminacion");
    const data = await cuartos.find().sort({ ts: 1 }).limit(50).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener datos");
  }
});

app.get("/api/movimiento", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Arqui1");
    const movs = database.collection("Movimiento");
    const data = await movs.find().sort({ ts: 1 }).limit(50).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener datos");
  }
});

app.get("/api/riego", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Arqui1");
    const movs = database.collection("Riego");
    const data = await movs.find().sort({ ts: 1 }).limit(50).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener datos");
  }
});

app.get("/api/temperatura", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Arqui1");
    const movs = database.collection("Temperatura");
    const data = await movs.find().sort({ ts: 1 }).limit(50).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener datos");
  }
});

app.get("/api/ventilacion", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Arqui1");
    const movs = database.collection("Ventilacion");
    const data = await movs.find().sort({ ts: 1 }).limit(50).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener datos");
  }
});


const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
