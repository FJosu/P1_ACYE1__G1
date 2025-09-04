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

export default function Graph_Mov() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/movimiento")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleTimeString(),
          presencia: d.evento === "PRESENCIA_ON" ? 1 : 0,
        }));
        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Grafica de Detección de movimiento</h2>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="presencia"
            fill="#ff7300"
            name="Presencia (ON=1, OFF=0)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
