import { useEffect, useState } from "react";

export default function Table_Vent() {
  const [data, setData] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(""); // Nuevo estado para la fecha

  useEffect(() => {
    fetch("http://localhost:4000/api/ventilacion")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map(d => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          fechaISO: d.ts.split("T")[0], // formato YYYY-MM-DD para filtro
          hora: new Date(d.ts).toLocaleTimeString(),
          evento: d.evento || "N/A",
          motivo: d.motivo || "N/A",
          temperatura: d.temperature !== undefined ? d.temperature : "N/A"
        }));
        setData(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  // Filtramos eventos según la fecha seleccionada
  const eventosFiltrados = fechaFiltro
    ? data.filter((e) => e.fechaISO === fechaFiltro)
    : data;

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-3">Tabla de registros de Ventilación</h2>
      {/* Input de filtro por fecha */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filtrar por fecha:</label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>

      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Hora</th>
            <th className="border border-gray-300 px-4 py-2">Evento</th>
            <th className="border border-gray-300 px-4 py-2">Motivo</th>
            <th className="border border-gray-300 px-4 py-2">Temperatura (°C)</th>
          </tr>
        </thead>
        <tbody>
          {eventosFiltrados.map((row, i) => (
            <tr key={i} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{row.fecha}</td>
              <td className="border border-gray-300 px-4 py-2">{row.hora}</td>
              <td className="border border-gray-300 px-4 py-2">{row.evento}</td>
              <td className="border border-gray-300 px-4 py-2">{row.motivo}</td>
              <td className="border border-gray-300 px-4 py-2">{row.temperatura}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
