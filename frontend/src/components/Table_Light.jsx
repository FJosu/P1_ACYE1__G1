import { useEffect, useState } from "react";

export default function Table_Light() {
  const [eventos, setEventos] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(""); // estado para la fecha seleccionada

  useEffect(() => {
    fetch("http://localhost:4000/api/cuartos")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          fechaISO: d.ts.split("T")[0], // formato YYYY-MM-DD para comparar
          hora: new Date(d.ts).toLocaleTimeString(),
          origen: d.origen,
          cuarto: d.room,
          descripcion: d.on ? "Encendido" : "Apagado",
        }));
        setEventos(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  const eventosFiltrados = fechaFiltro
    ? eventos.filter((e) => e.fechaISO === fechaFiltro)
    : eventos;

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Tabla de registros de Iluminación</h2>

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
            <th className="border border-gray-300 px-4 py-2">Cuarto</th>
            <th className="border border-gray-300 px-4 py-2">Descripción</th>
            <th className="border border-gray-300 px-4 py-2">Origen</th>
          </tr>
        </thead>
        <tbody>
          {eventosFiltrados.map((e, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-4 py-2">{e.fecha}</td>
              <td className="border border-gray-300 px-4 py-2">{e.hora}</td>
              <td className="border border-gray-300 px-4 py-2">{e.cuarto}</td>
              <td
                className={`border border-gray-300 px-4 py-2 font-semibold ${
                  e.descripcion === "Encendido" ? "text-red-600" : "text-green-600"
                }`}
              >
                {e.descripcion}
              </td>
              <td className="border border-gray-300 px-4 py-2">{e.origen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
