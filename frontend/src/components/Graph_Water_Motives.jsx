import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

export default function Graph_Water_Motives() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/riego")
      .then((res) => res.json())
      .then((datos) => {
        const motivos = {};
        datos.forEach((d) => {
          if (d.evento === "BOMBA_ON") {
            motivos[d.motivo] = (motivos[d.motivo] || 0) + 1;
          }
        });
        const formateados = Object.keys(motivos).map((m) => ({
          motivo: m,
          veces: motivos[m],
        }));
        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Motivos de activación de la bomba</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="motivo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="veces" fill="#00c49f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
