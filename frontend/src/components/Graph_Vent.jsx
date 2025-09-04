import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

export default function Graph_Vent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/ventilacion")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos
          .filter(d => d.temperature !== undefined)
          .map(d => ({
            fecha: new Date(d.ts).toLocaleTimeString(),
            temperatura: d.temperature,
            motivo: d.motivo || "N/A",
          }));

        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Grafica de Temperatura de Ventilación</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="temperatura"
            stroke="#ff7300"
            name="Temperatura (°C)"
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
