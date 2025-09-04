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

export default function Graph_Light() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/cuartos")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = [];

        datos.forEach((d) => {
          const fecha = new Date(d.ts).toLocaleTimeString();
          const existe = formateados.find((f) => f.fecha === fecha);

          if (existe) {
            existe[d.room] = d.on ? 1 : 0;
          } else {
            formateados.push({
              fecha,
              [d.room]: d.on ? 1 : 0,
            });
          }
        });

        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Grafica de Iluminación en Cuartos</h2>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="room1" fill="#82ca9d" name="Room 1" />
          <Bar dataKey="room2" fill="#8884d8" name="Room 2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
