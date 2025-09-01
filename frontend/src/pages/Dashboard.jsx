import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Graph_Alarm from "../components/Graph_Alarm";
import Graph_Light from "../components/Graph_Light";
import Graph_Mov from "../components/Graph_Mov";
import Graph_Water_Motives from "../components/Graph_Water_Motives";
import Graph_Water from "../components/Graph_Water";


export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Graph_Alarm />
        <Graph_Light />
        <Graph_Mov />
        <Graph_Water />
        <Graph_Water_Motives />
        <div className="bg-white shadow rounded-2xl p-4">📊 Gráficas aquí</div>
        <div className="bg-white shadow rounded-2xl p-4">📋 Tablas aquí</div>
        <div className="bg-white shadow rounded-2xl p-4">
          🚨 Alertas en tiempo real
        </div>
        <div className="bg-white shadow rounded-2xl p-4">
          <Link to="/control" className="text-blue-600 font-semibold">
            Ir a Control →
          </Link>
        </div>
      </div>
    </div>
  );
}
