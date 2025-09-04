import { useEffect, useState } from "react";

export default function Table_Alarm() {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/alarmas")
      .then((res) => res.json())
      .then((datos) => {
        const eventos = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          hora: new Date(d.ts).toLocaleTimeString(),
          temperatura: d.temperature ?? "-",
          estado: d.evento === "ALARM_ON" ? "Alarma Activada" : "Alarma Desactivada",
        }));
        setAlertas(eventos);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Tabla de Alarmas</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Hora</th>
            <th className="border border-gray-300 px-4 py-2">Temperatura (°C)</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {alertas.map((a, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-4 py-2">{a.fecha}</td>
              <td className="border border-gray-300 px-4 py-2">{a.hora}</td>
              <td className="border border-gray-300 px-4 py-2">{a.temperatura}</td>
              <td
                className={`border border-gray-300 px-4 py-2 font-semibold ${
                  a.estado === "Alarma Activada" ? "text-red-600" : "text-green-600"
                }`}
              >
                {a.estado}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
