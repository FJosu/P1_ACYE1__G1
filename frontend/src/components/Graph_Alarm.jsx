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

export default function Graph_Alarm() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/alarmas")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleTimeString(), 
          temperatura: d.temperature, 
          alarma: d.evento === "ALARM_ON" ? 1 : 0, 
        }));
        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-3">Temperatura y Alarmas</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis yAxisId="left" label={{ value: "°C", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
          <Tooltip />
          <Legend />

          {/* Temperatura */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperatura"
            stroke="#8884d8"
            name="Temperatura (°C)"
          />

          {/* Estado de alarma */}
          <Line
            yAxisId="right"
            type="stepAfter"
            dataKey="alarma"
            stroke="#ff0000"
            name="Alarma (ON=1, OFF=0)"
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
