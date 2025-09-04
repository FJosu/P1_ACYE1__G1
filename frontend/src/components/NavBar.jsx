import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Home, Settings, LogOut } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home size={24} />, path: "/dashboard" },
    { name: "Control", icon: <Settings size={24} />, path: "/control" },
  ];

  return (
    <aside
      className={`text-white h-full transition-all duration-300 ${
        isOpen ? "w-20" : "w-16"
      } flex flex-col items-center py-4`}
      style={{ backgroundColor: "#3396D3" }}
    >
      {/* Links */}
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="relative group flex justify-center p-2 hover:bg-blue-200 rounded"
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute left-full ml-2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.name}
            </span>
          </Link>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="relative group flex justify-center p-2 hover:bg-blue-200 rounded"
        >
          <LogOut size={24} />
          <span className="absolute left-full ml-2 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Cerrar sesión
          </span>
        </button>
      </nav>
    </aside>
  );
}
