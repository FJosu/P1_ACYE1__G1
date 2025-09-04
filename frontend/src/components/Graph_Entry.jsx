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

export default function Graph_Entry() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/entrada")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleTimeString(),
          estado: d.evento === "PORTON_OPEN" ? 1 : 0,
        }));
        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Gráfica de la Entrada</h2>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="estado"
            fill="#ff7300"
            name="Portón (1=Abierto, 0=Cerrado)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
