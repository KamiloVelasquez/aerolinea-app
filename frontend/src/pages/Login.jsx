import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../contexts/LanguageContext';

const API = 'http://localhost:5000/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || t('auth.errorConnection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h2>{t('auth.loginTitle')}</h2>
        <p className="form-subtitle">{t('auth.loginSubtitle')}</p>

        {error && <div className="alert alert-error">❌ {error}</div>}

        <div className="form-group">
          <label>{t('auth.emailLabel')}</label>
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
          <label>{t('auth.passwordLabel')}</label>
          <input
            type="password"
            className="form-input"
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn-search" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
          {loading ? t('auth.loggingIn') : t('auth.loginButton')}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#64748b' }}>
          {t('auth.noAccount')} <Link to="/registro" style={{ color: '#0b5ed7', fontWeight: 600 }}>{t('auth.registerLink')}</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
