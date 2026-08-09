import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const API = 'http://localhost:5000/api';

function Admin() {
  const [tab, setTab] = useState('vuelos');
  const [vuelos, setVuelos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [precio, setPrecio] = useState('');
  const [creando, setCreando] = useState(false);
  const { t } = useContext(LanguageContext);

  const getToken = () => localStorage.getItem('token');

  const headers = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(user);
      if (parsed.rol !== 'admin') {
        navigate('/');
        return;
      }
    } catch {
      navigate('/login');
      return;
    }

    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [vRes, rRes] = await Promise.all([
        axios.get(`${API}/vuelos`),
        axios.get(`${API}/reservas`, headers())
      ]);
      setVuelos(vRes.data);
      setReservas(rRes.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      setError(t('admin.errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  const crearVuelo = async (e) => {
    e.preventDefault();
    setCreando(true);
    setMensaje('');
    setError('');

    try {
      await axios.post(`${API}/vuelos`, { origen, destino, precio: Number(precio) }, headers());
      setOrigen('');
      setDestino('');
      setPrecio('');
      setMensaje(t('admin.createSuccess'));
      cargarDatos();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || t('admin.errorCreating'));
      setTimeout(() => setError(''), 3000);
    } finally {
      setCreando(false);
    }
  };

  const eliminarVuelo = async (id) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

    try {
      await axios.delete(`${API}/vuelos/${id}`, headers());
      setMensaje(t('admin.deleteSuccess'));
      cargarDatos();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || t('admin.errorDeleting'));
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="spinner"></div>
      </section>
    );
  }

  return (
    <section className="section">
      <h2 className="section-title">{t('admin.title')}</h2>
      <p className="section-subtitle">{t('admin.subtitle')}</p>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-grid">
        {/* Sidebar — Crear vuelo */}
        <div className="admin-panel">
          <h3>{t('admin.newFlight')}</h3>
          <form onSubmit={crearVuelo}>
            <div className="form-group">
              <label>{t('admin.originCity')}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t('admin.originCity')}
                value={origen}
                onChange={e => setOrigen(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('admin.destinationCity')}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t('admin.destinationCity')}
                value={destino}
                onChange={e => setDestino(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('admin.priceUsd')}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="120.50"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-full" disabled={creando}>
              {creando ? t('admin.creating') : t('admin.createFlight')}
            </button>
          </form>
        </div>

        {/* Main content */}
        <div>
          <div className="admin-tabs">
            <button
              className={`admin-tab ${tab === 'vuelos' ? 'active' : ''}`}
              onClick={() => setTab('vuelos')}
            >
              {t('admin.flightsTab')} ({vuelos.length})
            </button>
            <button
              className={`admin-tab ${tab === 'reservas' ? 'active' : ''}`}
              onClick={() => setTab('reservas')}
            >
              {t('admin.reservationsTab')} ({reservas.length})
            </button>
          </div>

          {tab === 'vuelos' && (
            <div className="admin-panel">
              {vuelos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">✈️</div>
                  <h3>{t('admin.noFlights')}</h3>
                  <p>{t('admin.noFlightsDescription')}</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('admin.colId')}</th>
                      <th>{t('admin.colOrigin')}</th>
                      <th>{t('admin.colDestination')}</th>
                      <th>{t('admin.colPrice')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {vuelos.map(v => (
                      <tr key={v.id}>
                        <td style={{ color: 'var(--text-muted)' }}>#{v.id}</td>
                        <td style={{ color: 'var(--text-primary)' }}>{v.origen}</td>
                        <td style={{ color: 'var(--text-primary)' }}>{v.destino}</td>
                        <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          ${Number(v.precio).toFixed(2)}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarVuelo(v.id)}
                          >
                            {t('admin.delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === 'reservas' && (
            <div className="admin-panel">
              {reservas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🎫</div>
                  <h3>{t('admin.noReservations')}</h3>
                  <p>{t('admin.noReservationsDescription')}</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('admin.colId')}</th>
                      <th>{t('admin.colUser')}</th>
                      <th>{t('admin.colEmail')}</th>
                      <th>{t('admin.colRoute')}</th>
                      <th>{t('admin.colPrice')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map(r => (
                      <tr key={r.id}>
                        <td style={{ color: 'var(--text-muted)' }}>#{r.id}</td>
                        <td style={{ color: 'var(--text-primary)' }}>{r.usuario_nombre}</td>
                        <td>{r.usuario_email}</td>
                        <td style={{ color: 'var(--text-primary)' }}>
                          {r.origen} → {r.destino}
                        </td>
                        <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          ${Number(r.precio).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Admin;
