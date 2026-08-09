import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
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
  }, [location]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const triggerCheckIn = (e) => {
    e.preventDefault();
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

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✈️</span>
          <span>AeroViajes</span>
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              {t('navbar.flights')}
            </Link>
          </li>

          <li>
            <a
              href="#ofertas"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
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
              <Link to="/mis-reservas" className={`nav-link ${isActive('/mis-reservas')}`}>
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
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowInfoDropdown(true)}
            onMouseLeave={() => setShowInfoDropdown(false)}
          >
            <a href="#info" className="nav-link" onClick={(e) => e.preventDefault()}>
              {t('navbar.information')} <span style={{ fontSize: '0.7rem' }}>▼</span>
            </a>

            {showInfoDropdown && (
              <div className="nav-dropdown">
                <a href="#equipaje" onClick={(e) => {
                  e.preventDefault();
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
              <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
                ⚙️ Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="nav-right">
          <div className="lang-selector" onClick={onToggleLang} title={t('navbar.changeLang')}>
            🌐 {lang} <span style={{ fontSize: '0.7rem' }}>▼</span>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ color: 'white', fontSize: '0.88rem', fontWeight: 600 }}>
                👤 {user.nombre}
              </span>
              <button
                onClick={logout}
                className="btn-nav-auth"
                style={{ cursor: 'pointer', background: 'transparent' }}
              >
                {t('navbar.logout')}
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-nav-auth">
              {t('navbar.login')}
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
