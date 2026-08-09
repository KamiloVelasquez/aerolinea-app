import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const API = 'http://localhost:5000/api';

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
      return;
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    axios.get(`${API}/reservas/mis-reservas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // Enriquecer reservas con datos adicionales para simular billete real
        const enriched = res.data.map((r, index) => {
          const codes = {
            'bogotá': 'BOG', 'medellín': 'MDE', 'madrid': 'MAD', 
            'miami': 'MIA', 'parís': 'CDG', 'cali': 'CLO'
          };
          const getCode = (city) => codes[city.toLowerCase().trim()] || city.substring(0, 3).toUpperCase();
          
          return {
            ...r,
            origenCodigo: getCode(r.origen),
            destinoCodigo: getCode(r.destino),
            pnr: `AV-${8000 + r.id}`,
            asiento: `${index + 12}${['A', 'C', 'D', 'F'][index % 4]}`,
            puerta: `A${(index % 8) + 1}`,
            embarque: '05:30 PM',
            vuelo: `AV-${300 + r.id}`
          };
        });
        setReservas(enriched);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        setError(t('reservas.errorLoad'));
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const cancelarReserva = async (reservaId) => {
    if (!confirm(t('reservas.confirmCancel'))) return;

    setCancelingId(reservaId);
    setError('');
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${API}/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(prev => prev.filter(r => r.id !== reservaId));
    } catch (err) {
      setError(err.response?.data?.error || t('reservas.errorCancel'));
    } finally {
      setCancelingId(null);
    }
  };

  const verPase = (r) => {
    window.dispatchEvent(new CustomEvent('open-checkin', {
      detail: {
        codigo: r.pnr,
        apellido: user ? user.nombre.split(' ')[user.nombre.split(' ').length - 1] : 'PASAJERO',
        vuelo: r.vuelo,
        asiento: r.asiento,
        puerta: r.puerta,
        origen: `${r.origen} (${r.origenCodigo})`,
        destino: `${r.destino} (${r.destinoCodigo})`,
        autoSubmit: true
      }
    }));
  };

  if (loading) {
    return (
      <section className="main-container" style={{ marginTop: '2rem' }}>
        <div className="spinner"></div>
      </section>
    );
  }

  return (
    <section className="main-container" style={{ marginTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: '0.2rem' }}>{t('reservas.title')}</h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>{t('reservas.subtitle')}</p>
        </div>
        <Link to="/" className="btn-outline-blue" style={{ width: 'auto', padding: '0.6rem 1.2rem', textDecoration: 'none' }}>
          {t('reservas.reserveNew')}
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {reservas.length === 0 ? (
        <div className="empty-state" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div className="empty-state-icon">🛫</div>
          <h3>{t('reservas.noReservations')}</h3>
          <p>{t('reservas.noReservationsDescription')}</p>
          <Link to="/" className="btn-search" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', height: '46px', paddingTop: '12px' }}>
            {t('reservas.exploreFlights')}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reservas.map(r => (
            <div className="ticket-card" key={r.id}>
              {/* Ticket header status bar */}
              <div className="ticket-header">
                  <span className="ticket-pnr">{t('reservas.reservationCode')}: <strong>{r.pnr}</strong></span>
                  <span className="ticket-status-badge">{t('reservas.confirmed')}</span>
              </div>

              {/* Ticket Body layout */}
              <div className="ticket-body">
                {/* Route layout */}
                <div className="ticket-route-section">
                  <div className="ticket-airport">
                    <span className="airport-code">{r.origenCodigo}</span>
                    <span className="airport-city">{r.origen}</span>
                  </div>
                  <div className="ticket-flight-path">
                    <span className="flight-number">{r.vuelo}</span>
                    <div className="flight-line">
                      <span>✈️</span>
                    </div>
                  </div>
                  <div className="ticket-airport">
                    <span className="airport-code">{r.destinoCodigo}</span>
                    <span className="airport-city">{r.destino}</span>
                  </div>
                </div>

                {/* Info layout */}
                <div className="ticket-info-grid">
                  <div>
                    <span className="info-label">{t('reservas.passenger')}</span>
                    <span className="info-val">{user ? user.nombre : t('reservas.passengerFallback')}</span>
                  </div>
                  <div>
                    <span className="info-label">{t('reservas.boarding')}</span>
                    <span className="info-val">{r.embarque}</span>
                  </div>
                  <div>
                    <span className="info-label">{t('reservas.seat')}</span>
                    <span className="info-val" style={{ color: '#0b5ed7' }}>{r.asiento}</span>
                  </div>
                  <div>
                    <span className="info-label">{t('reservas.gate')}</span>
                    <span className="info-val">{r.puerta}</span>
                  </div>
                </div>

                {/* Price and actions */}
                <div className="ticket-action-section">
                  <div className="ticket-price-container">
                    <span className="price-label">{t('reservas.totalFare')}</span>
                    <span className="price-val">USD {Number(r.precio).toFixed(2)}</span>
                  </div>
                  <div className="ticket-buttons">
                    <button 
                      className="btn-search" 
                      style={{ height: '42px', padding: '0 1.2rem', fontSize: '0.86rem' }}
                      onClick={() => verPase(r)}
                    >
                      {t('reservas.boardingPass')}
                    </button>
                    <button 
                      className="btn-outline-blue" 
                      style={{ borderColor: '#e11d48', color: '#e11d48', height: '42px', padding: '0 1.2rem', fontSize: '0.86rem' }}
                      onClick={() => cancelarReserva(r.id)}
                      disabled={cancelingId === r.id}
                    >
                      {cancelingId === r.id ? t('reservas.canceling') : t('reservas.cancelTrip')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MisReservas;
