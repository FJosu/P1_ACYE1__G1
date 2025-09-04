import Graph_Alarm from "../components/Graph_Alarm";
import Table_Alarm from "../components/Table_Alarm";
import Graph_Entry from "../components/Graph_Entry";
import Table_Entry from "../components/Table_Entry";
import Graph_Light from "../components/Graph_Light";
import Table_Light from "../components/Table_Light";
import Graph_Mov from "../components/Graph_Mov";
import Table_Mov from "../components/Table_Mov";
import Graph_Water from "../components/Graph_Water";
import Table_Water_Motives from "../components/Table_Water_Motives";
import Graph_Temperature from "../components/Graph_Temperature";
import Table_Temperature from "../components/Table_Temperature";
import Graph_Vent from "../components/Graph_Vent";
import Table_Vent from "../components/Table_Vent";

function Section({ graph, table, reverse = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } bg-white shadow rounded-2xl p-6 items-center gap-6`}
    >
      {/* Gráfica */}
      <div className="flex-1">{graph}</div>

      {/* Tablas */}
      <div className="flex-1">{table}</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#EEF5FF" }}>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="space-y-6">
        {/* Secciones intercaladas */}
        <Section
          graph={<Graph_Alarm />}
          table={<Table_Alarm />}
        />
        <Section
          graph={<Graph_Entry />}
          table={<Table_Entry />}
        />
        <Section
          graph={<Graph_Light />}
          table={<Table_Light />}
          reverse
        />
        <Section
          graph={<Graph_Mov />}
          table={<Table_Mov />}
        />
        <Section
          graph={<Graph_Water />}
          table={<Table_Water_Motives />}
          reverse
        />
        <Section
          graph={<Graph_Temperature />}
          table={<Table_Temperature />}
          reverse
        />
        <Section
          graph={<Graph_Vent />}
          table={<Table_Vent />}
        />

        {/* Tablas */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">📋 Tablas</h2>
          <p className="text-gray-600">Aquí se mostrarán las tablas de datos relevantes.</p>
        </div>

        {/* Alertas en tiempo real */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">🚨 Alertas en tiempo real</h2>
          <p className="text-gray-600">Visualiza las alertas más recientes en vivo.</p>
        </div>
      </div>
    </div>
  );
}
