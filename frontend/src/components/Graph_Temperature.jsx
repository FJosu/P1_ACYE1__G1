import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

export default function Graph_Temperature() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/temperatura")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleTimeString(),
          temperatura: d.temperature,
          humedad: d.humidity,
        }));
        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Grafica de Temperatura y Humedad</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis
            yAxisId="left"
            label={{ value: "°C", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "% Humedad", angle: -90, position: "insideRight" }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperatura"
            stroke="#ff7300"
            name="Temperatura (°C)"
            dot
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="humedad"
            stroke="#0077ff"
            name="Humedad (%)"
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
