import Graph_Alarm from "../components/Graph_Alarm";
import Graph_Light from "../components/Graph_Light";
import Graph_Mov from "../components/Graph_Mov";
import Graph_Water_Motives from "../components/Graph_Water_Motives";
import Graph_Water from "../components/Graph_Water";

function Section({ graph, title, description, reverse = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } bg-white shadow rounded-2xl p-6 items-center gap-6`}
    >
      {/* Gráfica */}
      <div className="flex-1">{graph}</div>

      {/* Descripción */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
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
          title="Alarmas"
          description="Visualiza las estadísticas de alarmas activadas en tiempo real."
        />
        <Section
          graph={<Graph_Light />}
          title="Luces"
          description="Esta debe de ser una grafica de lineas."
          reverse
        />
        <Section
          graph={<Graph_Mov />}
          title="Movimiento"
          description="Esta grafica debe de ser de barras."
        />
        <Section
          graph={<Graph_Water />}
          title="Consumo de Agua"
          description="Métricas de uso de agua en las instalaciones."
          reverse
        />
        <Section
          graph={<Graph_Water_Motives />}
          title="Motivos de Consumo de Agua"
          description="Esta tambien debe de ser una tabla que se para."
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
