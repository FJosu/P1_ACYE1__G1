import { Sun, Moon, DoorOpen, Fan } from "lucide-react";

const controls = [
  { label: "Encender Luz Cuarto 1", color: "from-yellow-400 to-orange-600", icon: <Sun size={24} /> },
  { label: "Apagar Luz Cuarto 1", color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },
  { label: "Encender Luz Cuarto 2", color: "from-blue-400 to-purple-600", icon: <Sun size={24} /> },
  { label: "Apagar Luz Cuarto 2", color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },
  { label: "Encender Luz Cuarto 3", color: "from-red-400 to-pink-600", icon: <Sun size={24} /> },
  { label: "Apagar Luz Cuarto 3", color: "from-gray-400 to-gray-600", icon: <Moon size={24} /> },
  { label: "Cambiar Color de Luz", color: "from-purple-400 to-pink-400", icon: <Fan size={24} /> },
  { label: "Abrir Portón", color: "from-blue-400 to-cyan-400", icon: <DoorOpen size={24} /> },
];

export default function Control() {
  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#EEF5FF" }}>
      <h1 className="text-3xl font-bold mb-6">Control</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {controls.map((control, index) => (
          <button
            key={index}
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
      </div>
    </div>
  );
}
