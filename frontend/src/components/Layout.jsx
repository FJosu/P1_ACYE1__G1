import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* NavBar lateral */}
      <NavBar />

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet /> {/* Aquí se renderizan Dashboard, Control, etc. */}
      </main>
    </div>
  );
}
