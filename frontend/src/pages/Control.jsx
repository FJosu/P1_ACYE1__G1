import { useAuth } from "../context/AuthContext";

export default function Control() {
  const { logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Control</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-green-500 text-white p-4 rounded-2xl shadow">
          Encender Luz
        </button>
        <button className="bg-gray-500 text-white p-4 rounded-2xl shadow">
          Apagar Luz
        </button>
        <button className="bg-blue-500 text-white p-4 rounded-2xl shadow">
          Abrir Portón
        </button>
        <button className="bg-yellow-500 text-white p-4 rounded-2xl shadow">
          Activar Ventilador
        </button>
      </div>
    </div>
  );
}
