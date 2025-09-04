import { useEffect, useState } from "react";

export default function Table_Vent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/ventilacion")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map(d => ({
          fecha: new Date(d.ts).toLocaleString(),
          evento: d.evento || "N/A",
          motivo: d.motivo || "N/A",
          temperatura: d.temperature !== undefined ? d.temperature : "N/A"
        }));
        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-3">Tabla de registros de Ventilación</h2>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Fecha y Hora</th>
            <th className="px-4 py-2 border">Evento</th>
            <th className="px-4 py-2 border">Motivo</th>
            <th className="px-4 py-2 border">Temperatura (°C)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">{row.fecha}</td>
              <td className="px-4 py-2 border">{row.evento}</td>
              <td className="px-4 py-2 border">{row.motivo}</td>
              <td className="px-4 py-2 border">{row.temperatura}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
