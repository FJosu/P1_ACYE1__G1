import { useEffect, useState } from "react";

export default function Table_Entry() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/entrada")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          hora: new Date(d.ts).toLocaleTimeString(),
          evento: d.evento,
          origen: d.origen,
        }));
        setEventos(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Tabla de Eventos de la Entrada</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Hora</th>
            <th className="border border-gray-300 px-4 py-2">Descripción</th>
            <th className="border border-gray-300 px-4 py-2">Origen</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-4 py-2">{e.fecha}</td>
              <td className="border border-gray-300 px-4 py-2">{e.hora}</td>
              <td className="border border-gray-300 px-4 py-2">{e.evento}</td>
              <td className="border border-gray-300 px-4 py-2">{e.origen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
