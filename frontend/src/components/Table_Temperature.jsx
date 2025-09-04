import { useEffect, useState } from "react";

export default function Table_Temperature() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/temperatura")
      .then((res) => res.json())
      .then((datos) => {
        const formateados = datos.map((d) => ({
          fecha: new Date(d.ts).toLocaleDateString(),
          hora: new Date(d.ts).toLocaleTimeString(),
          temperatura: d.temperature,
          humedad: d.humidity,
        }));
        setEventos(formateados);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Tabla de registro de Temperatura y Humedad</h2>
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
          {eventos.map((e, i) => (
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
