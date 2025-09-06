import { useState } from "react";
import { Sun, Moon, DoorOpen, Fan } from "lucide-react";

export default function Control() {
  const [rgbColor, setRgbColor] = useState("#ff0000"); // color inicial rojo

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

    // RGB Dinámico
    { label: "Cambiar Color Luz RGB", api: "/api/iluminacion", payload: { room: "rgb", action: rgbColor }, color: `from-${rgbColor} to-${rgbColor}`, icon: <Fan size={24} />, isRgb: true },
    { label: "Apagar Luz RGB", api: "/api/iluminacion", payload: { room: "rgb", action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

    // Portón
    { label: "Abrir Portón", api: "/api/entrada", payload: { action: "open" }, color: "from-blue-400 to-cyan-400", icon: <DoorOpen size={24} /> },
    { label: "Cerrar Portón", api: "/api/entrada", payload: { action: "close" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

    // Ventilador
    { label: "Encender Ventilador", api: "/api/ventilacion", payload: { action: "on" }, color: "from-green-400 to-emerald-600", icon: <Fan size={24} /> },
    { label: "Apagar Ventilador", api: "/api/ventilacion", payload: { action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

    // Bomba
    { label: "Activar Bomba de Agua", api: "/api/bomba", payload: { action: "on" }, color: "from-teal-400 to-cyan-600", icon: <Fan size={24} /> },
    { label: "Desactivar Bomba de Agua", api: "/api/bomba", payload: { action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },

    // Alarmas
    { label: "Encender Alarma", api: "/api/alarma", payload: { action: "on" }, color: "from-red-400 to-red-600", icon: <Sun size={24} /> },
    { label: "Apagar Alarma", api: "/api/alarma", payload: { action: "off" }, color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },
  ];

  const handleClick = async (control) => {
    let payload = control.payload;

    // Para el RGB, convertir hex a RGB antes de enviar
    if (control.isRgb) {
      const r = parseInt(rgbColor.substr(1, 2), 16);
      const g = parseInt(rgbColor.substr(3, 2), 16);
      const b = parseInt(rgbColor.substr(5, 2), 16);
      payload = { room: "rgb", action: `${r},${g},${b}` };
    }

    await fetch(`http://localhost:4000${control.api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const handleRgbChange = (e) => {
    setRgbColor(e.target.value);
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#EEF5FF" }}>
      <h1 className="text-3xl font-bold mb-6">Control</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {controls.map((control, index) => {
          // Para el control RGB de color, mostrar input color en lugar de solo botón
          if (control.isRgb) {
            return (
              <div key={index} className="flex flex-col items-center gap-3 p-6 rounded-2xl 
                  bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold shadow-lg 
                  transition transform hover:scale-105 hover:shadow-2xl">
                <span>{control.label}</span>
                <input
                  type="color"
                  value={rgbColor}
                  onChange={handleRgbChange}
                  className="w-20 h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
                <button
                  onClick={() => handleClick(control)}
                  className="mt-2 px-4 py-2 bg-pink-500 rounded-lg shadow hover:bg-purple-700 transition"
                >
                  ENCENDER
                </button>
              </div>
            );
          }

          return (
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
          );
        })}
      </div>
    </div>
  );
}
