import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const API = 'http://localhost:5000/api';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/auth/register`, { nombre, email, password, rol });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || t('auth.errorConnection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <div className="auth-brand">
          <span className="auth-badge">AeroViajes</span>
          <h2>{t('auth.registerTitle')}</h2>
          <p className="form-subtitle">{t('auth.registerSubtitle')}</p>
        </div>

        {error && <div className="alert alert-error">❌ {error}</div>}

        <div className="form-group">
          <label>{t('auth.nameLabel')}</label>
          <input
            type="text"
            className="form-input"
            placeholder={t('auth.namePlaceholder')}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('auth.emailLabelRegister')}</label>
          <input
            type="email"
            className="form-input"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('auth.passwordLabelRegister')}</label>
          <input
            type="password"
            className="form-input"
            placeholder={t('auth.passwordPlaceholderRegister')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>Rol</label>
          <select
            className="form-input"
            value={rol}
            onChange={e => setRol(e.target.value)}
            required
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button className="btn-search btn-form-submit" disabled={loading}>
          {loading ? t('auth.creatingAccount') : t('auth.registerButton')}
        </button>

        <p className="form-footer-text">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="form-footer-link">
            {t('auth.loginNow')}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
