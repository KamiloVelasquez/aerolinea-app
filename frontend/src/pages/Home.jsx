import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const API = 'http://localhost:5000/api';

function Home() {
  const [vuelos, setVuelos] = useState([]);
  const [vuelosFiltrados, setVuelosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [reservando, setReservando] = useState(null);
  
  // Search state
  const { t, lang } = useContext(LanguageContext);

  const [origenSearch, setOrigenSearch] = useState('Bogotá (BOG)');
  const [destinoSearch, setDestinoSearch] = useState('Madrid (MAD)');
  const [fechaSearch, setFechaSearch] = useState('');
  const [pasajeros, setPasajeros] = useState('');
  const [tabActive, setTabActive] = useState('roundtrip');
  const [activeDot, setActiveDot] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setFechaSearch(t('home.defaultDateRange'));
    setPasajeros(t('home.defaultPassengersClass'));
  }, [lang]);

  useEffect(() => {
    axios.get(`${API}/vuelos`)
      .then(res => {
        setVuelos(res.data);
        setVuelosFiltrados(res.data);
        setError('');
      })
      .catch(() => {
        setError(t('home.errorLoadFlights'));
      })
      .finally(() => setLoading(false));
  }, [t]);

  const reservar = async (vueloId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setReservando(vueloId);
    setMensaje('');

    try {
      await axios.post(`${API}/reservas`, { vuelo_id: vueloId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje(t('home.reservationSuccess'));
      setTimeout(() => setMensaje(''), 4000);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      setMensaje('❌ ' + (err.response?.data?.error || t('home.errorReserveFlight')));
      setTimeout(() => setMensaje(''), 4000);
    } finally {
      setReservando(null);
    }
  };

  const swapCities = () => {
    const temp = origenSearch;
    setOrigenSearch(destinoSearch);
    setDestinoSearch(temp);
  };

  const handleBuscarVuelos = (e) => {
    e.preventDefault();
    const origClean = origenSearch.split('(')[0].trim().toLowerCase();
    const destClean = destinoSearch.split('(')[0].trim().toLowerCase();

    const result = vuelos.filter(v => {
      const matchOrig = !origClean || v.origen.toLowerCase().includes(origClean);
      const matchDest = !destClean || v.destino.toLowerCase().includes(destClean);
      return matchOrig && matchDest;
    });

    if (result.length > 0) {
      setVuelosFiltrados(result);
      setMensaje(t('home.searchResults', { count: result.length }));
    } else {
      setVuelosFiltrados(vuelos);
      setMensaje(t('home.searchShowingAll', { origen: origenSearch, destino: destinoSearch }));
    }

    setTimeout(() => setMensaje(''), 4000);

    const el = document.getElementById('vuelos-seccion');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Promociones predefinidas tipo AeroViajes con imágenes reales y desplazamiento dinámico
  const ofertasDestacadasAll = [
    { id: 101, origen: 'Bogotá', destino: 'Miami', precio: 198, img: '/dest_miami.png', tipo: 'roundtrip' },
    { id: 102, origen: 'Medellín', destino: 'Madrid', precio: 499, img: '/dest_madrid.png', tipo: 'roundtrip' },
    { id: 103, origen: 'Cali', destino: 'París', precio: 549, img: '/dest_paris.png', tipo: 'roundtrip' },
    { id: 104, origen: 'Bogotá', destino: 'París', precio: 599, img: '/dest_paris.png', tipo: 'roundtrip' },
    { id: 105, origen: 'Medellín', destino: 'Miami', precio: 220, img: '/dest_miami.png', tipo: 'roundtrip' },
    { id: 106, origen: 'Cali', destino: 'Miami', precio: 230, img: '/dest_miami.png', tipo: 'roundtrip' },
    { id: 107, origen: 'Bogotá', destino: 'Madrid', precio: 480, img: '/dest_madrid.png', tipo: 'roundtrip' }
  ];

  // Mostrar 3 ofertas desplazadas según el punto activo del carrusel
  const ofertasDestacadas = ofertasDestacadasAll.slice(activeDot, activeDot + 3);

  return (
    <>
      {/* Hero Banner Header */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">{t('home.heroTitle')}</h1>
          <p className="hero-subtitle">
            {t('home.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Floating Flight Search Widget */}
      <div className="search-widget-wrapper">
        <div className="search-widget">
          {/* Tabs */}
          <div className="search-tabs">
            <button
              className={`tab-btn ${tabActive === 'roundtrip' ? 'active' : ''}`}
              onClick={() => setTabActive('roundtrip')}
            >
              <span>⇄</span> {t('home.tabRoundtrip')}
            </button>
            <button
              className={`tab-btn ${tabActive === 'oneway' ? 'active' : ''}`}
              onClick={() => setTabActive('oneway')}
            >
              <span>✈</span> {t('home.tabOneWay')}
            </button>
            <button
              className={`tab-btn ${tabActive === 'multi' ? 'active' : ''}`}
              onClick={() => setTabActive('multi')}
            >
              <span>🔀</span> {t('home.tabMulti')}
            </button>
          </div>

          {/* Form */}
          <form className="search-form" onSubmit={handleBuscarVuelos}>
            <div className="input-box">
              <label>{t('home.origin')}</label>
              <input
                type="text"
                value={origenSearch}
                onChange={(e) => setOrigenSearch(e.target.value)}
              />
            </div>

            <button type="button" className="btn-swap" onClick={swapCities} title={t('home.swapTitle') || 'Swap origin/destination'}>
              ⇄
            </button>

            <div className="input-box">
              <label>{t('home.destination')}</label>
              <input
                type="text"
                value={destinoSearch}
                onChange={(e) => setDestinoSearch(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>{t('home.dates')}</label>
              <input
                type="text"
                value={fechaSearch}
                onChange={(e) => setFechaSearch(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>{t('home.passengersAndClass')}</label>
              <input
                type="text"
                value={pasajeros}
                onChange={(e) => setPasajeros(e.target.value)}
              />
            </div>

            <button className="btn-search" type="submit">
              {t('home.searchFlights')}
            </button>
          </form>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div
              className="badge-item"
              style={{ cursor: 'pointer' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-infomodal', {
                detail: {
                  title: t('home.badgeTitleBestPrice'),
                  body: t('home.badgeBodyBestPrice'),
                  icon: '🛡️'
                }
              }))}
            >
              <div className="badge-icon">🛡️</div>
              <div>
                <div className="badge-text-title">{t('home.badgeTitleBestPrice')}</div>
                <div className="badge-text-sub">{t('home.badgeSubBestPrice')}</div>
              </div>
            </div>

            <div
              className="badge-item"
              style={{ cursor: 'pointer' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-infomodal', {
                detail: {
                  title: t('home.badgeTitleSecurePayment'),
                  body: t('home.badgeBodySecurePayment'),
                  icon: '🔒'
                }
              }))}
            >
              <div className="badge-icon">🔒</div>
              <div>
                <div className="badge-text-title">{t('home.badgeTitleSecurePayment')}</div>
                <div className="badge-text-sub">{t('home.badgeSubSecurePayment')}</div>
              </div>
            </div>

            <div
              className="badge-item"
              style={{ cursor: 'pointer' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-infomodal', {
                detail: {
                  title: t('home.badgeTitleAttention247'),
                  body: t('home.badgeBodyAttention247'),
                  icon: '🕒'
                }
              }))}
            >
              <div className="badge-icon">🕒</div>
              <div>
                <div className="badge-text-title">{t('home.badgeTitleAttention247')}</div>
                <div className="badge-text-sub">{t('home.badgeSubAttention247')}</div>
              </div>
            </div>

            <div
              className="badge-item"
              style={{ cursor: 'pointer' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-infomodal', {
                detail: {
                  title: t('home.badgeTitleFlexibleChanges'),
                  body: t('home.badgeBodyFlexibleChanges'),
                  icon: '🔄'
                }
              }))}
            >
              <div className="badge-icon">🔄</div>
              <div>
                <div className="badge-text-title">{t('home.badgeTitleFlexibleChanges')}</div>
                <div className="badge-text-sub">{t('home.badgeSubFlexibleChanges')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Section */}
      <main className="main-container">
        {mensaje && (
          <div className={`alert ${mensaje.startsWith('✅') || mensaje.startsWith('🔍') ? 'alert-success' : 'alert-error'}`}>
            {mensaje}
          </div>
        )}

        <div className="dashboard-layout">
          {/* Left Side — Ofertas destacadas */}
          <div>
            <div id="ofertas-section">
              <h2 className="section-title">{t('home.featuredOffers')}</h2>

              <div className="offers-grid">
                {ofertasDestacadas.map((item) => (
                  <div className="offer-card" key={item.id}>
                    <div className="offer-img-container">
                      <img src={item.img} alt={item.destino} className="offer-img" loading="eager" />
                    </div>
                    <div className="offer-body">
                      <div className="offer-route">{item.origen} → {item.destino}</div>
                      <div className="offer-price-row">
                        <span className="offer-price-label">{t(`home.offerType.${item.tipo}`)}</span>
                        <span className="offer-price-val">{t('home.offerPriceFrom', { price: item.precio })}</span>
                      </div>
                      <button
                        className="offer-btn-book"
                        onClick={() => {
                          const dbVuelo = vuelos.find(v => v.origen.toLowerCase().includes(item.origen.toLowerCase()));
                          if (dbVuelo) {
                            reservar(dbVuelo.id);
                          } else if (vuelos.length > 0) {
                            reservar(vuelos[0].id);
                          } else {
                            alert(t('home.reservationSimulated'));
                          }
                        }}
                      >
                        {t('home.reserve')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="pagination-row">
                <button
                  className="arrow-circle-btn"
                  onClick={() => setActiveDot(prev => Math.max(0, prev - 1))}
                >
                  ‹
                </button>
                {[0, 1, 2, 3, 4].map(idx => (
                  <button
                    key={idx}
                    className={`dot-btn ${activeDot === idx ? 'active' : ''}`}
                    onClick={() => setActiveDot(idx)}
                  ></button>
                ))}
                <button
                  className="arrow-circle-btn"
                  onClick={() => setActiveDot(prev => Math.min(4, prev + 1))}
                >
                  ›
                </button>
              </div>
            </div>

            {/* Todos los vuelos de la base de datos */}
            <div id="vuelos-seccion" style={{ marginTop: '2.5rem' }}>
              <h2 className="section-title">{t('home.availableFlights')}</h2>
              {loading ? (
                <p>{t('home.loadingFlights')}</p>
              ) : vuelosFiltrados.length === 0 ? (
                <p>{t('home.noFlights')}</p>
              ) : (
                <div className="offers-grid">
                  {vuelosFiltrados.map(v => (
                    <div className="offer-card" key={v.id}>
                      <div className="offer-body">
                        <div className="offer-route">{v.origen} → {v.destino}</div>
                        <div className="offer-price-row">
                          <span className="offer-price-label">{t('home.standardFare')}</span>
                          <span className="offer-price-val">{t('home.offerPriceFrom', { price: Number(v.precio).toFixed(0) })}</span>
                        </div>
                        <button
                          className="offer-btn-book"
                          onClick={() => reservar(v.id)}
                          disabled={reservando === v.id}
                        >
                          {reservando === v.id ? t('home.reserving') : t('home.reserve')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar — Promociones & Check-in */}
          <aside className="sidebar-promos">
            {/* Dark Promo Box */}
            <div className="promo-box-dark">
              <div className="promo-icon">🎫</div>
              <h3>{t('home.rightPanelRegisterHeading')}</h3>
              <p>{t('home.rightPanelRegisterDescription')}</p>
              <Link to="/registro">
                <button className="btn-white">{t('home.rightPanelButtonCreateAccount')}</button>
              </Link>
            </div>

            {/* Light Promo Box */}
            <div className="promo-box-light">
              <div className="promo-icon" style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>📱</div>
              <h3>{t('home.rightPanelCheckInTitle')}</h3>
              <p>{t('home.rightPanelCheckInDescription')}</p>
              <button
                className="btn-outline-blue"
                onClick={() => window.dispatchEvent(new CustomEvent('open-checkin'))}
              >
                {t('home.rightPanelCheckInButton')}
              </button>
            </div>
          </aside>
        </div>

        {/* Bottom Features Banner */}
        <section className="bottom-features">
          <div
            className="feature-item"
            style={{ cursor: 'pointer' }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-infomodal', {
              detail: {
                title: t('home.featureBaggageTitle'),
                body: t('home.featureBaggageBody'),
                icon: '🧳'
              }
            }))}
          >
            <div className="feature-icon">🧳</div>
            <div>
              <div className="feature-title">{t('home.featureBaggageTitle')}</div>
              <div className="feature-desc">{t('home.featureBaggageDesc')}</div>
            </div>
          </div>

          <div
            className="feature-item"
            style={{ cursor: 'pointer' }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-infomodal', {
              detail: {
                title: t('home.featureMilesTitle'),
                body: t('home.featureMilesBody'),
                icon: '✈️'
              }
            }))}
          >
            <div className="feature-icon">✈️</div>
            <div>
              <div className="feature-title">{t('home.featureMilesTitle')}</div>
              <div className="feature-desc">{t('home.featureMilesDesc')}</div>
            </div>
          </div>

          <div
            className="feature-item"
            style={{ cursor: 'pointer' }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-infomodal', {
              detail: {
                title: t('home.featureSafetyTitle'),
                body: t('home.featureSafetyBody'),
                icon: '🛡️'
              }
            }))}
          >
            <div className="feature-icon">🛡️</div>
            <div>
              <div className="feature-title">{t('home.featureSafetyTitle')}</div>
              <div className="feature-desc">{t('home.featureSafetyDesc')}</div>
            </div>
          </div>

          <div
            className="feature-item"
            style={{ cursor: 'pointer' }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-infomodal', {
              detail: {
                title: t('home.featureAppTitle'),
                body: t('home.featureAppBody'),
                icon: '📱'
              }
            }))}
          >
            <div className="feature-icon">📱</div>
            <div>
              <div className="feature-title">{t('home.featureAppTitle')}</div>
              <div className="feature-desc">{t('home.featureAppDesc')}</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
