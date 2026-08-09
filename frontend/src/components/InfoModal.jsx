import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useContext(LanguageContext);
  const [content, setContent] = useState({ title: '', body: '', icon: 'ℹ️' });

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail) {
        setContent({
          title: e.detail.title || t('navbar.infoTitle'),
          body: e.detail.body || '',
          icon: e.detail.icon || 'ℹ️'
        });
        setIsOpen(true);
      }
    };

    window.addEventListener('open-infomodal', handleOpen);
    return () => window.removeEventListener('open-infomodal', handleOpen);
  }, [t]);

  const closeModal = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>✕</button>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '2.8rem' }}>{content.icon}</span>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.45rem', fontWeight: 800, marginTop: '0.5rem', color: '#1e293b' }}>
            {content.title}
          </h3>
        </div>
        <div style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', textAlign: 'center', marginBottom: '1.5rem' }}>
          {content.body}
        </div>
        <button className="btn-search" style={{ width: '100%' }} onClick={closeModal}>
          {t('infoModal.okButton')}
        </button>
      </div>
    </div>
  );
}

export default InfoModal;
