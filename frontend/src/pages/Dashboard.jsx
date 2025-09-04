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

function Section({ titulo, graph, description, reverse = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } bg-white shadow rounded-2xl p-6 items-center gap-6 relative`}
    >
      <div className="absolute top-4 left-6 text-xl font-bold">
        {titulo}
      </div>

      {/* Gráfica */}
      <div className="flex-1 pt-10">{graph}</div>

      {/* Tablas */}
      <div className="flex-1 text-center">{description}</div>
    </div>
  );
}


export default function Dashboard() {
  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#EEF5FF" }}>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="space-y-6">
        
        <Section
          titulo={<h1 className="text-2xl font-bold mb-3">📊 Gráficas</h1>}
          graph={<Graph_Alarm />}
          description="Muestra los momentos en que se activaron o desactivaron las alarmas de la casa (por ejemplo, cuando la temperatura subió demasiado). Sirve para ver la frecuencia de alertas en el tiempo."
        />
        
        <Section
          graph={<Graph_Entry />}
          description="Registra cada vez que el portón se abre o se cierra. Ayuda a identificar los horarios de mayor movimiento de entrada o salida en la vivienda."
          reverse
        />
        <Section
          graph={<Graph_Light />}
          description="Refleja el encendido y apagado de las luces en las distintas habitaciones y del sistema RGB. Facilita ver qué espacios se usan más y en qué horarios hay mayor consumo de iluminación."
        />
        <Section
          graph={<Graph_Mov />}
          description="Registra cuándo se detectó presencia o ausencia en la casa. Ayuda a visualizar en qué momentos hubo más actividad o movimiento en el hogar."
          reverse
        />
        <Section
          graph={<Graph_Water />}
          description="Muestra cuándo la bomba se activó o apagó, ya sea manualmente o de forma automática al detectar suelo seco. Sirve para monitorear el consumo de agua y el riego del jardín."
        />
        <Section
          graph={<Graph_Temperature />}
          description="Refleja los cambios de temperatura en el ambiente a lo largo del tiempo. Útil para identificar patrones diarios y momentos de calor o frío en la vivienda. Ayuda a identificar espacios con altas temperaturas para aplicar acciones.
          Indica la humedad relativa del ambiente registrada en diferentes momentos. Permite analizar el confort ambiental y detectar condiciones de sequedad o exceso de humedad."
          reverse
        />
        <Section
          graph={<Graph_Vent />}
          description="Indica cuándo el ventilador estuvo encendido o apagado, ya sea automáticamente (por temperatura) o manualmente desde el sistema. Te permite analizar el uso del ventilador a lo largo del día."
        />


        {/* Tablas */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">📋 Tablas</h2>
          <p>
            <Table_Alarm />
            <Table_Entry />
            <Table_Light />
            <Table_Mov />
            <Table_Water_Motives />
            <Table_Temperature />
            <Table_Vent />
          </p>
        </div>

      </div>
    </div>
  );
}
