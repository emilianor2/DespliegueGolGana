import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Register.css"; // Asegúrate de que este archivo contenga el CSS proporcionado

const Register = () => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Telefono: "",
    Correo: "",
    Password: "",
    Tipo: "cliente",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar mensaje de error cuando el usuario empieza a escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/usuarios", formData);
      setSuccess("Registro exitoso, ahora puedes iniciar sesión.");
      
      // Pequeña pausa para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error("Error en el registro", error);
      setError(
        error.response?.data?.mensaje || "Error al registrar usuario. Por favor intenta nuevamente."
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <div className="register-logo">GOLGANA</div>
        <h1 className="register-title">Crear una cuenta</h1>
        <p className="register-subtitle">
          Completa el formulario para unirte a la plataforma de gestión de predios agrícolas
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            name="Nombre"
            placeholder="Ingresa tu nombre completo"
            value={formData.Nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            className="form-control"
            name="Telefono"
            placeholder="Ej: +56 9 1234 5678"
            value={formData.Telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            className="form-control"
            name="Correo"
            placeholder="tucorreo@ejemplo.com"
            value={formData.Correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-control"
            name="Password"
            placeholder="Crea una contraseña segura"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo de cuenta</label>
          <select
            id="tipo"
            className="form-select"
            name="Tipo"
            value={formData.Tipo}
            onChange={handleChange}
          >
            <option value="cliente">Cliente</option>
            <option value="empleado">Empleado</option>
          </select>
        </div>

        <button
          type="submit"
          className="register-button"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>

      <div className="register-divider">
        <span className="register-divider-text">o</span>
      </div>

      <div className="login-link">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login">Inicia sesión aquí</Link>
      </div>
    </div>
  );
};

export default Register;