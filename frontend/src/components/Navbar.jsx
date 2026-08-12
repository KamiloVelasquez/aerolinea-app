import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, toggleLang, t } = useContext(LanguageContext);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    // Cerrar menú móvil en cambio de ruta
    setMobileMenuOpen(false);
    setShowInfoDropdown(false);
  }, [location]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const triggerCheckIn = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-checkin'));
  };

  const onToggleLang = () => {
    const next = lang === 'ES' ? 'EN' : 'ES';
    toggleLang();
    window.dispatchEvent(new CustomEvent('open-infomodal', {
      detail: {
        title: t('navbar.langChangedTitle', next),
        body: t('navbar.langChangedBody', next),
        icon: '🌐'
      }
    }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setShowInfoDropdown(false);
  };

  return (
    <header className="navbar-container">
      <nav className="navbar" aria-label="Navegación principal">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <span className="brand-icon">✈️</span>
          <span>AeroViajes</span>
        </Link>

        {/* Botón menú hamburguesa para dispositivos móviles */}
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Contenedor colapsable del menú */}
        <div className={`navbar-collapse ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-menu">
            <li>
              <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMobileMenu}>
                {t('navbar.flights')}
              </Link>
            </li>

            <li>
              <a
                href="#ofertas"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                  if (location.pathname !== '/') navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById('ofertas-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                {t('navbar.offers')}
              </a>
            </li>

            {user && (
              <li>
                <Link to="/mis-reservas" className={`nav-link ${isActive('/mis-reservas')}`} onClick={closeMobileMenu}>
                  {t('navbar.myReservations')}
                </Link>
              </li>
            )}

            <li>
              <a href="#checkin" className="nav-link" onClick={triggerCheckIn}>
                {t('navbar.checkIn')}
              </a>
            </li>

            <li
              className="nav-dropdown-item"
              onMouseEnter={() => setShowInfoDropdown(true)}
              onMouseLeave={() => setShowInfoDropdown(false)}
            >
              <button
                type="button"
                className="nav-link nav-dropdown-btn"
                onClick={() => setShowInfoDropdown(!showInfoDropdown)}
                aria-expanded={showInfoDropdown}
              >
                {t('navbar.information')} <span className="caret-icon">▼</span>
              </button>

              {showInfoDropdown && (
                <div className="nav-dropdown">
                  <a href="#equipaje" onClick={(e) => {
                    e.preventDefault();
                    closeMobileMenu();
                    window.dispatchEvent(new CustomEvent('open-infomodal', {
                      detail: {
                        title: t('navbar.baggagePolicyTitle'),
                        body: t('navbar.baggagePolicyBody'),
                        icon: '🧳'
                      }
                    }));
                  }}>
                    🧳 {t('navbar.baggagePolicyTitle')}
                  </a>
                  <a href="#estado" onClick={(e) => {
                    e.preventDefault();
                    closeMobileMenu();
                    window.dispatchEvent(new CustomEvent('open-infomodal', {
                      detail: {
                        title: t('navbar.flightStatusTitle'),
                        body: t('navbar.flightStatusBody'),
                        icon: '🛫'
                      }
                    }));
                  }}>
                    🛫 {t('navbar.flightStatusTitle')}
                  </a>
                  <a href="#soporte" onClick={(e) => {
                    e.preventDefault();
                    closeMobileMenu();
                    window.dispatchEvent(new CustomEvent('open-infomodal', {
                      detail: {
                        title: t('navbar.supportCenterTitle'),
                        body: t('navbar.supportCenterBody'),
                        icon: '📞'
                      }
                    }));
                  }}>
                    📞 {t('navbar.supportCenterTitle')}
                  </a>
                </div>
              )}
            </li>

            {user && user.rol === 'admin' && (
              <li>
                <Link to="/admin" className={`nav-link ${isActive('/admin')}`} onClick={closeMobileMenu}>
                  ⚙️ Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="nav-right">
            <button
              type="button"
              className="lang-selector"
              onClick={onToggleLang}
              title={t('navbar.changeLang')}
            >
              🌐 {lang} <span className="caret-icon">▼</span>
            </button>

            {user ? (
              <div className="nav-user-block">
                <span className="nav-user-name">
                  👤 {user.nombre}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="btn-nav-auth"
                >
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-nav-auth" onClick={closeMobileMenu}>
                {t('navbar.login')}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

