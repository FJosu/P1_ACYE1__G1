import { useEffect, useState } from "react";

export default function Table_Mov() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/movimiento")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          hora: new Date(d.ts).toLocaleTimeString(),
          evento: d.evento,
        }));
        setEventos(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Tabla de registro de Movimientos</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Hora</th>
            <th className="border border-gray-300 px-4 py-2">Evento</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e, i) => (
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
