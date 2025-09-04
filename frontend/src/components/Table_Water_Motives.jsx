import { useEffect, useState } from "react";

export default function Table_Water_Motives() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/riego")
      .then((res) => res.json())
      .then((datos) => {
        const bombaOnEvents = datos.filter(d => d.evento === "BOMBA_ON");
        const tabla = bombaOnEvents.map(event => {
          const lecturaObj = datos.find(
            d =>
              (d.tipo === "bomba_activada" || d.tipo === "suelo_lectura") &&
              new Date(d.ts) >= new Date(event.ts)
          );
          return {
            fecha: new Date(event.ts).toLocaleString(),
            lectura: lecturaObj ? lecturaObj.lectura || lecturaObj.estado : "N/A",
            motivo: event.motivo || "N/A",
          };
        });

        setData(tabla);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-3">Tabla de registro de Riego</h2>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Fecha y Hora</th>
            <th className="px-4 py-2 border">Motivo</th>
            <th className="px-4 py-2 border">Lectura de Humedad</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">{row.fecha}</td>
              <td className="px-4 py-2 border">{row.motivo}</td>
              <td className="px-4 py-2 border">{row.lectura}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
