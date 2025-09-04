import { useEffect, useState } from "react";

export default function Table_Temperature() {
  const [eventos, setEventos] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(""); // Nuevo estado para la fecha

  useEffect(() => {
    fetch("http://localhost:4000/api/temperatura")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          fechaISO: d.ts.split("T")[0], // formato YYYY-MM-DD para filtro
          hora: new Date(d.ts).toLocaleTimeString(),
          temperatura: d.temperature,
          humedad: d.humidity,
        }));
        setEventos(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  // Filtramos eventos según la fecha seleccionada
  const eventosFiltrados = fechaFiltro
    ? eventos.filter((e) => e.fechaISO === fechaFiltro)
    : eventos;

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Tabla de registro de Temperatura y Humedad</h2>

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

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Hora</th>
            <th className="border border-gray-300 px-4 py-2">Temperatura</th>
            <th className="border border-gray-300 px-4 py-2">Humedad</th>
          </tr>
        </thead>
        <tbody>
          {eventosFiltrados.map((e, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-4 py-2">{e.fecha}</td>
              <td className="border border-gray-300 px-4 py-2">{e.hora}</td>
              <td className="border border-gray-300 px-4 py-2">{e.temperatura}</td>
              <td className="border border-gray-300 px-4 py-2">{e.humedad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
