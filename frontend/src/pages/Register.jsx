import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const API = 'http://localhost:5000/api';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await axios.post(`${API}/auth/register`, { nombre, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || t('auth.errorConnection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="glass-form" onSubmit={submit}>
        <h2>{t('auth.registerTitle')}</h2>
        <p className="form-subtitle">{t('auth.registerSubtitle')}</p>

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

        <button className="btn btn-primary btn-full" disabled={loading}>
          {loading ? t('auth.creatingAccount') : t('auth.registerButton')}
        </button>

        <p className="form-footer">
          {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.loginNow')}</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
