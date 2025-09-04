const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const mqtt = require("mqtt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ==================== MongoDB ====================
const uri = "mongodb+srv://MariAbi:papasfritas14@cluster0.pij2euq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// ==================== MQTT (HiveMQ Cloud) ====================
const MQTT_HOST = "332362e6e921400e87b8124f8bfc0546.s1.eu.hivemq.cloud";
const MQTT_PORT = 8883;
const MQTT_USER = "Arqui1";
const MQTT_PASS = "Pass1234";

const mqttClient = mqtt.connect(`mqtts://${MQTT_HOST}:${MQTT_PORT}`, {
  username: MQTT_USER,
  password: MQTT_PASS,
});

mqttClient.on("connect", () => {
  console.log("✅ Backend conectado a HiveMQ");
});
mqttClient.on("error", (err) => {
  console.error("❌ Error MQTT:", err);
});

// ==================== Funciones Mongo ====================
async function getAlarmas() {
  await client.connect();
  const database = client.db("Arqui1");
  const alarmas = database.collection("Alarmas");
  return alarmas.find().sort({ fecha: 1 }).limit(50).toArray();
}

// ==================== ENDPOINTS GET ====================
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

// ==================== ENDPOINTS POST (MQTT) ====================

// Iluminación (cuartos y RGB)
app.post("/api/iluminacion", (req, res) => {
  const { room, action } = req.body;
  let payload;

  if (room === "rgb") {
    payload = `rgb ${action}`; // ej. "rgb 255,0,0"
  } else {
    payload = `${room} ${action}`; // ej. "room1 on"
  }

  mqttClient.publish("/ilumination", payload, () => {
    console.log("📤 Publicado:", payload);
    res.json({ ok: true, sent: payload });
  });
});

// Portón
app.post("/api/entrada", (req, res) => {
  const { action } = req.body; // "open" | "close"
  mqttClient.publish("/entrance", action, () => {
    console.log("📤 Portón:", action);
    res.json({ ok: true, sent: action });
  });
});

// Ventilador
app.post("/api/ventilacion", (req, res) => {
  const { action } = req.body;
  mqttClient.publish("/ventilador", action, () => {
    console.log("📤 Ventilador:", action);
    res.json({ ok: true, sent: action });
  });
});

// Bomba de agua
app.post("/api/bomba", (req, res) => {
  const { action } = req.body;
  mqttClient.publish("/bombaagua", action, () => {
    console.log("📤 Bomba:", action);
    res.json({ ok: true, sent: action });
  });
});

// ==================== RUN SERVER ====================
const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
