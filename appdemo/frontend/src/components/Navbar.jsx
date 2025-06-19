import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/Navbar.css"; // Asegúrate de crear este archivo con el CSS proporcionado

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>GOLGANA</span>
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" className={isActive("/")}>
              Inicio
            </Link>
          </li>

          {!user ? (
            <>
              <li>
                <Link to="/login" className={isActive("/login")}>
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className={isActive("/register")}>
                  Registrarse
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/dashboard" className={isActive("/dashboard")}>
                  Panel
                </Link>
              </li>

              {user.tipo === "empleado" ? (
                <li className="admin-dropdown">
                  <div className="admin-dropdown-toggle">Administración</div>
                  <div className="admin-dropdown-menu">
                    <Link to="/reservas-admin" className={isActive("/reservas-admin")}>
                      Gestionar Reservas
                    </Link>
                    <Link to="/crear-predio" className={isActive("/crear-predio")}>
                      Crear Predio
                    </Link>
                    <Link to="/predios" className={isActive("/predios")}>
                      Mis Predios
                    </Link>
                    <Link to="/mis-canchas" className={isActive("/mis-canchas")}>
                      Mis Canchas
                    </Link>
                  </div>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/reservas" className={isActive("/reservas")}>
                      Mis Reservas
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link to="/buscar-predios" className={isActive("/buscar-predios")}>
                  Buscar Predios
                </Link>
              </li>

              <li className="navbar-user">
                <div>
                  <strong>{user.Nombre}</strong>
                  <span className="email">({user.Correo})</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  Salir
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;