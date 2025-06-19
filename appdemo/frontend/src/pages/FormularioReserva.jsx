import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs'; // Asegúrate de importar dayjs correctamente
import 'dayjs/locale/es'; // Esto es para establecer la localización en español
import '../style/FormularioReserva.css';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const diasAFecha = {
  'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4,
  'Viernes': 5, 'Sábado': 6, 'Domingo': 0,
};

const FormularioReserva = () => {
  const { id } = useParams();
  const [cancha, setCancha] = useState(null);
  const { token } = useAuth();

  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [pago, setPago] = useState('');
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const obtenerCancha = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/canchas/${id}`);
        setCancha(res.data);
      } catch {
        setMensaje({ tipo: 'error', texto: 'Error al cargar la información de la cancha.' });
      }
    };

    // Función para obtener las reservas de la semana
    const obtenerReservas = async () => {
      const lunes = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD');
      try {
        const res = await axios.get(`http://localhost:5000/api/reservas/canchas/${id}/semana?inicio=${lunes}`);
        setReservas(res.data);  // Aquí se cargan las reservas
      } catch {
        setMensaje({ tipo: 'error', texto: 'Error al cargar las reservas.' });
      }
    };

    obtenerCancha();
    obtenerReservas();
  }, [id]);

  const generarFranjaHoraria = (horarioDisponible) => {
    if (!horarioDisponible) return [];
    const [inicio, fin] = horarioDisponible.split('-');
    const inicioHora = parseInt(inicio.split(':')[0]);
    const finHora = parseInt(fin.split(':')[0]);
    return Array.from({ length: finHora - inicioHora }, (_, i) =>
      `${(inicioHora + i).toString().padStart(2, '0')}:00`
    );
  };

  const estaOcupado = (fecha, hora) => {
    return reservas.some(r => {
      const horaReserva = r.HoraReserva.slice(0, 5);
      const fechaReserva = new Date(r.FechaReserva).toISOString().split("T")[0]; // 🔥
      return fechaReserva === fecha && horaReserva === hora;
    });
  };

    const obtenerFechaISO = (dia, hora) => {
    const hoy = dayjs(); // Fecha actual
    const hoyDia = hoy.day(); // 0=domingo
    const targetDia = diasAFecha[dia]; // Domingo=0, Lunes=1, etc
    // La diferencia en días
    const diasAdelante = (targetDia - hoyDia + 7) % 7;

    // Obtenemos el lunes de esta semana
    const inicioSemana = hoy.startOf('week').add(1, 'day'); // El lunes

    let fechaSeleccionada = inicioSemana.add(diasAdelante, 'day');
    // Añadimos la hora
    fechaSeleccionada = fechaSeleccionada.set('hour', parseInt(hora.split(':')[0]));
    fechaSeleccionada = fechaSeleccionada.set('minute', 0);

    const fechaISO = fechaSeleccionada.format('YYYY-MM-DD');
    const esPasado = fechaSeleccionada.isBefore(dayjs(), 'minute');

    return { fechaISO, esPasado };
  };

  const handleSeleccion = (dia, hora) => {
    const { fechaISO, esPasado } = obtenerFechaISO(dia, hora);
    if (estaOcupado(fechaISO, hora) || esPasado) {
      return; // Evitar selección en pasado u ocupado
    }
    setFecha(fechaISO);
    setHorario(hora);
  };

    const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const fecha = dayjs(fechaStr).locale('es'); // Usar dayjs para formatear correctamente
    return fecha.format('dddd, D [de] MMMM [de] YYYY'); // Formato largo con día de la semana
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha || !horario || !pago) {
      setMensaje({ tipo: 'error', texto: 'Por favor, selecciona un horario y forma de pago.' });
      return;
    }

    const fechaISO = dayjs(fecha).format('YYYY-MM-DD');
    const ocupado = estaOcupado(fechaISO, horario);
    if (ocupado) {
      setMensaje({ tipo: 'error', texto: 'El turno ya está ocupado. Por favor, elige otro horario.' });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reservas', {
        IDCancha: Number(id),
        FechaReserva: fecha,
        HoraReserva: horario,
        MetodoPago: pago,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Agregar la reserva al estado
      setReservas(prev => [
        ...prev,
        {
          FechaReserva: fecha,
          HoraReserva: horario,
        }
      ]);

      setMensaje({ tipo: 'success', texto: 'Reserva realizada con éxito' });
      setPago('');

      // Actualizar las reservas de la semana
      const lunes = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD');
      const res = await axios.get(`http://localhost:5000/api/reservas/canchas/${id}/semana?inicio=${lunes}`);
      setReservas(res.data);
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al realizar la reserva. Intente nuevamente.' });
    }
  };

  if (!cancha) return <div className="reserva-container"><p>Cargando cancha...</p></div>;

  const franjas = generarFranjaHoraria(cancha.HorarioDisponible);

  return (
    <div className="reserva-container">
      <div className="reserva-header football-decoration">
        <h1>Reservar cancha: {cancha.NombreCancha}</h1>
      </div>

      <div className="cancha-info">
        <p><span className="label">Capacidad:</span> {cancha.Capacidad} jugadores</p>
        <p><span className="label">Disciplina:</span> {cancha.Disciplina}</p>
        <p><span className="label">Horario disponible:</span> {cancha.HorarioDisponible}</p>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <h2 className="seccion-titulo">Seleccionar día y horario</h2>

      <div className="leyenda">
        <div className="leyenda-item"><div className="leyenda-color color-disponible"></div><span>Disponible</span></div>
        <div className="leyenda-item"><div className="leyenda-color color-seleccionado"></div><span>Seleccionado</span></div>
        <div className="leyenda-item"><div className="leyenda-color color-ocupado"></div><span>Ocupado</span></div>
        <div className="leyenda-item"><div className="leyenda-color color-pasado"></div><span>Pasado</span></div>
      </div>

      <table className="tabla-horarios">
        <thead>
          <tr>
            <th>Horario</th>
            {diasSemana.map(dia => <th key={dia}>{dia}</th>)}
          </tr>
        </thead>
        <tbody>
          {franjas.map(hora => (
            <tr key={hora}>
              <td className="hora-celda">{hora}</td>
              {diasSemana.map(dia => {
                const { fechaISO, esPasado } = obtenerFechaISO(dia, hora);
                const ocupado = estaOcupado(fechaISO, hora);
                const seleccionado = fecha === fechaISO && horario === hora;

                // Añadimos la clase 'celda-ocupada' si está ocupado
                const clasesCelda = [
                  'celda-disponible',
                  ocupado ? 'celda-ocupada' : '',
                  seleccionado ? 'celda-seleccionada' : '',
                  esPasado ? 'celda-pasada' : '',
                ].filter(Boolean).join(' ');

                return (
                  <td
                    key={`${dia}-${hora}`}
                    className={clasesCelda}
                    onClick={() => {
                      if (ocupado || esPasado) return; // No permitir selección en ocupado o pasado
                      handleSeleccion(dia, hora);
                    }}
                  >
                    {/* Mostrar "Ocupado" si está ocupado */}
                    {esPasado ? 'Pasado' : ocupado ? 'Ocupado' : seleccionado ? 'Seleccionado' : 'Disponible'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <form className="reserva-form" onSubmit={handleSubmit}>
        {fecha && horario && (
          <div className="fecha-seleccionada">
            <span className="fecha-seleccionada-label">Turno seleccionado:</span>
            {formatearFecha(fecha)} a las {horario} hs
          </div>
        )}

        <div className="form-group">
          <label>Forma de pago:</label>
          <select value={pago} onChange={(e) => setPago(e.target.value)} required>
            <option value="">Seleccionar</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={!fecha || !horario || !pago}
        >
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
};

export default FormularioReserva;
