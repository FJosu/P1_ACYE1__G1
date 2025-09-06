import { useEffect, useState } from "react";

export default function Table_Mov() {
  const [eventos, setEventos] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(""); 

  useEffect(() => {
    fetch("http://localhost:4000/api/movimiento")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          fechaISO: d.ts.split("T")[0],
          hora: new Date(d.ts).toLocaleTimeString(),
          evento: d.evento,
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
      <h2 className="text-xl font-bold mb-3">Tabla de registro de Movimientos</h2>

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
            <th className="border border-gray-300 px-4 py-2">Evento</th>
          </tr>
        </thead>
        <tbody>
          {eventosFiltrados.map((e, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-4 py-2">{e.fecha}</td>
              <td className="border border-gray-300 px-4 py-2">{e.hora}</td>
              <td
                className={`border border-gray-300 px-4 py-2 font-semibold ${
                  e.evento === "PRESENCIA_OFF" ? "text-red-600" : "text-green-600"
                }`}
              >
                {e.evento}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
