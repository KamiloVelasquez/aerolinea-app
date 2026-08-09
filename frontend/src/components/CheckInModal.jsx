import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function CheckInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [codigoReserva, setCodigoReserva] = useState('');
  const [apellido, setApellido] = useState('');
  const [boardingPass, setBoardingPass] = useState(null);
  const [error, setError] = useState('');
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail) {
        setCodigoReserva(e.detail.codigo || '');
        setApellido(e.detail.apellido || '');
        if (e.detail.autoSubmit) {
          // Generar directamente el pase de abordar
          setBoardingPass({
            codigo: (e.detail.codigo || 'AV-8492').toUpperCase(),
            pasajero: (e.detail.apellido || 'PEREZ').toUpperCase(),
            vuelo: e.detail.vuelo || 'AV-305',
            asiento: e.detail.asiento || '12D',
            puerta: e.detail.puerta || 'B4',
            embarque: '06:45 AM',
            origen: e.detail.origen || 'Bogotá (BOG)',
            destino: e.detail.destino || 'Madrid (MAD)',
            estado: t('checkIn.statusConfirmed')
          });
        }
      }
      setIsOpen(true);
    };
    window.addEventListener('open-checkin', handleOpen);
    return () => window.removeEventListener('open-checkin', handleOpen);
  }, []);

  const handleCheckIn = (e) => {
    e.preventDefault();
    setError('');

    if (!codigoReserva || !apellido) {
      setError(t('checkIn.errorCompleteFields'));
      return;
    }

    // Generar pase de abordar simulado pero completamente detallado
    setBoardingPass({
      codigo: codigoReserva.toUpperCase(),
      pasajero: apellido.toUpperCase(),
      vuelo: 'AV-' + Math.floor(100 + Math.random() * 900),
      asiento: Math.floor(1 + Math.random() * 30) + ['A', 'B', 'C', 'D', 'F'][Math.floor(Math.random() * 5)],
      puerta: 'B' + Math.floor(1 + Math.random() * 18),
      embarque: '06:45 AM',
      origen: 'Bogotá (BOG)',
      destino: 'Madrid (MAD)',
      estado: t('checkIn.statusConfirmed')
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setCodigoReserva('');
    setApellido('');
    setBoardingPass(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>✕</button>

        {!boardingPass ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.5rem' }}>📱</span>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem' }}>
                {t('checkIn.title')}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                {t('checkIn.subtitle')}
              </p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleCheckIn}>
              <div className="form-group">
                <label>{t('checkIn.pnrLabel')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('checkIn.pnrPlaceholder')}
                  value={codigoReserva}
                  onChange={(e) => setCodigoReserva(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('checkIn.lastNameLabel')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('checkIn.lastNamePlaceholder')}
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>

              <button className="btn-search" style={{ width: '100%', marginTop: '0.8rem' }}>
                {t('checkIn.getBoardingPass')}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem' }}>🎫</div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#00875a' }}>
              {t('checkIn.successTitle')}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {t('checkIn.successSubtitle')}
            </p>

            <div className="boarding-pass-card">
              <div className="bp-header">
                <span>{t('checkIn.passengerLabel').toUpperCase()}: {boardingPass.pasajero}</span>
                <span>{boardingPass.estado}</span>
              </div>
              <div className="bp-body">
                <div>
                  <div className="bp-label">{t('checkIn.flightLabel')}</div>
                  <div className="bp-val">{boardingPass.vuelo}</div>
                </div>
                <div>
                  <div className="bp-label">{t('checkIn.seatLabel')}</div>
                  <div className="bp-val" style={{ color: '#0b5ed7' }}>{boardingPass.asiento}</div>
                </div>
                <div>
                  <div className="bp-label">{t('checkIn.gateLabel')}</div>
                  <div className="bp-val">{boardingPass.puerta}</div>
                </div>
                <div>
                  <div className="bp-label">{t('checkIn.boardingLabel')}</div>
                  <div className="bp-val">{boardingPass.embarque}</div>
                </div>
              </div>
              <div className="bp-footer">
                {t('checkIn.pnrLabel')}: <strong>{boardingPass.codigo}</strong> | {t('checkIn.routeLabel')}: {boardingPass.origen} → {boardingPass.destino}
              </div>
            </div>

            <button className="btn-search" style={{ width: '100%', marginTop: '1.5rem' }} onClick={closeModal}>
              {t('checkIn.downloadButton')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckInModal;
