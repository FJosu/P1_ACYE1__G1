import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

export default function Graph_Water() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/riego")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos
          .filter((d) => d.evento === "BOMBA_ON" || d.evento === "BOMBA_OFF")
          .map((d) => ({
            fecha: new Date(d.ts).toLocaleTimeString(),
            bomba: d.evento === "BOMBA_ON" ? 1 : 0,
            motivo: d.motivo || "N/A",
          }));
        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Grafica de estado de riego</h2>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="bomba"
            fill="#0077ff"
            name="Bomba (ON=1, OFF=0)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
