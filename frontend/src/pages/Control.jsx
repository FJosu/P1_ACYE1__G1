import { useState } from "react";
import { Sun, Moon, DoorOpen, Fan } from "lucide-react";

const controls = [
  // Cuarto 1
  { label: "Encender Luz Cuarto 1", api: "/api/iluminacion", payload: { room: "room1", action: "on" }, color: "from-yellow-400 to-orange-600", icon: <Sun size={24} /> },
  { label: "Apagar Luz Cuarto 1", api: "/api/iluminacion", payload: { room: "room1", action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

  // Cuarto 2
  { label: "Encender Luz Cuarto 2", api: "/api/iluminacion", payload: { room: "room2", action: "on" }, color: "from-blue-400 to-purple-600", icon: <Sun size={24} /> },
  { label: "Apagar Luz Cuarto 2", api: "/api/iluminacion", payload: { room: "room2", action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

  // Cuarto 3
  { label: "Encender Luz Cuarto 3", api: "/api/iluminacion", payload: { room: "room3", action: "on" }, color: "from-red-400 to-pink-600", icon: <Sun size={24} /> },
  { label: "Apagar Luz Cuarto 3", api: "/api/iluminacion", payload: { room: "room3", action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

  // RGB (botón fijo ejemplo)
  { label: "Cambiar Color de Luz (Rojo)", api: "/api/iluminacion", payload: { room: "rgb", action: "255,0,0" }, color: "from-purple-400 to-pink-400", icon: <Fan size={24} /> },

  // Portón
  { label: "Abrir Portón", api: "/api/entrada", payload: { action: "open" }, color: "from-blue-400 to-cyan-400", icon: <DoorOpen size={24} /> },
  { label: "Cerrar Portón", api: "/api/entrada", payload: { action: "close" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

  // Ventilador
  { label: "Encender Ventilador", api: "/api/ventilacion", payload: { action: "on" }, color: "from-green-400 to-emerald-600", icon: <Fan size={24} /> },
  { label: "Apagar Ventilador", api: "/api/ventilacion", payload: { action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

  // Bomba
  { label: "Activar Bomba de Agua", api: "/api/bomba", payload: { action: "on" }, color: "from-teal-400 to-cyan-600", icon: <Fan size={24} /> },
  { label: "Desactivar Bomba de Agua", api: "/api/bomba", payload: { action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },
];

export default function Control() {
  const [rgbColor, setRgbColor] = useState("#ffffff"); // color inicial

  const handleClick = async (control) => {
    await fetch(`http://localhost:4000${control.api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(control.payload),
    });
  };

  const handleRgbChange = async (e) => {
    const hex = e.target.value;
    setRgbColor(hex);

    // Convertir HEX → RGB
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    // Enviar al backend
    await fetch("http://localhost:4000/api/iluminacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: "rgb", action: `${r},${g},${b}` }),
    });
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#EEF5FF" }}>
      <h1 className="text-3xl font-bold mb-6">Control</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {controls.map((control, index) => (
          <button
            key={index}
            onClick={() => handleClick(control)}
            className={`
              flex flex-col items-center justify-center gap-3 p-6 rounded-2xl 
              bg-gradient-to-r ${control.color} 
              text-white font-semibold shadow-lg 
              transition transform hover:scale-105 hover:shadow-2xl
            `}
          >
            {control.icon}
            <span>{control.label}</span>
          </button>
        ))}

        {/* 🎨 Selector de color dinámico */}
        <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white shadow-lg">
          <label className="font-semibold">Seleccionar Color RGB</label>
          <input
            type="color"
            value={rgbColor}
            onChange={handleRgbChange}
            className="w-20 h-20 cursor-pointer border rounded-full shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
