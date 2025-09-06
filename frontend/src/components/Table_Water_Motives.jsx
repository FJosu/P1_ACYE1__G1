import { useEffect, useState } from "react";

export default function Table_Water_Motives() {
  const [data, setData] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(""); 

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
            fechaISO: event.ts.split("T")[0], 
            lectura: lecturaObj ? lecturaObj.lectura || lecturaObj.estado : "N/A",
            motivo: event.motivo || "N/A",
          };
        });

        setData(tabla);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  const eventosFiltrados = fechaFiltro
    ? data.filter((e) => e.fechaISO === fechaFiltro)
    : data;

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-3">Tabla de registro de Riego</h2>

      {/*filtro por fecha */}
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
            <th className="border border-gray-300 px-4 py-2">Fecha y Hora</th>
            <th className="border border-gray-300 px-4 py-2">Motivo</th>
            <th className="border border-gray-300 px-4 py-2">Lectura de Humedad</th>
          </tr>
        </thead>
        <tbody>
          {eventosFiltrados.map((e, i) => (
            <tr key={i} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{e.fecha}</td>
              <td className="border border-gray-300 px-4 py-2">{e.motivo}</td>
              <td className="border border-gray-300 px-4 py-2">{e.lectura}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
