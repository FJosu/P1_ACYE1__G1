import { useEffect, useState } from "react";

export default function Table_Alarm() {
  const [alertas, setAlertas] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(""); // estado para la fecha seleccionada

  useEffect(() => {
    fetch("http://localhost:4000/api/alarmas")
      .then((res) => res.json())
      .then((datos) => {
        const eventos = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          fechaISO: d.ts.split("T")[0], // YYYY-MM-DD para filtro
          hora: new Date(d.ts).toLocaleTimeString(),
          temperatura: d.temperature ?? "-",
          estado: d.evento === "ALARM_ON" ? "Alarma Activada" : "Alarma Desactivada",
        }));
        setAlertas(eventos);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  // Filtrar por fecha
  const alertasFiltradas = fechaFiltro
    ? alertas.filter((a) => a.fechaISO === fechaFiltro)
    : alertas;

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Tabla de Alarmas</h2>

      {/* Filtro por fecha */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filtrar por fecha:</label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>

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
          {alertasFiltradas.map((a, i) => (
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
