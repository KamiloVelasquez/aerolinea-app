import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../contexts/LanguageContext';

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState('');
  const { t } = useContext(LanguageContext);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribedMsg(t('footer.subscribedMessage'));
    setNewsletterEmail('');
    setTimeout(() => setSubscribedMsg(''), 5000);
  };

  const showInfo = (title, body, icon = 'ℹ️') => {
    window.dispatchEvent(new CustomEvent('open-infomodal', {
      detail: { title, body, icon }
    }));
  };

  return (
    <footer className="footer-container">
      {/* Top Newsletter Strip */}
      <div className="footer-newsletter-strip">
        <div className="footer-newsletter-content">
          <div>
            <h3>{t('footer.newsletterHeading')}</h3>
            <p>{t('footer.newsletterText')}</p>
          </div>
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder={t('footer.newsletterPlaceholder')}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit">{t('footer.subscribe')}</button>
          </form>
        </div>
        {subscribedMsg && (
          <div className="alert alert-success" style={{ marginTop: '1rem', marginBottom: 0, maxWidth: '1240px', marginLeft: 'auto', marginRight: 'auto' }}>
            {subscribedMsg}
          </div>
        )}
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="footer-col">
          <div className="footer-brand">
            <span style={{ fontSize: '1.6rem' }}>✈️</span>
            <span>{t('footer.brandHeading')}</span>
          </div>
          <p className="footer-about">
            {t('footer.about')}
          </p>
          <div className="footer-socials">
            <a href="#facebook" title="Facebook" onClick={(e) => { e.preventDefault(); showInfo(t('footer.socialFacebookTitle'), t('footer.socialFacebookBody'), '📘'); }}>📘</a>
            <a href="#twitter" title="X (Twitter)" onClick={(e) => { e.preventDefault(); showInfo(t('footer.socialTwitterTitle'), t('footer.socialTwitterBody'), '🐦'); }}>🐦</a>
            <a href="#instagram" title="Instagram" onClick={(e) => { e.preventDefault(); showInfo(t('footer.socialInstagramTitle'), t('footer.socialInstagramBody'), '📷'); }}>📷</a>
            <a href="#linkedin" title="LinkedIn" onClick={(e) => { e.preventDefault(); showInfo(t('footer.socialLinkedInTitle'), t('footer.socialLinkedInBody'), '💼'); }}>💼</a>
            <a href="#youtube" title="YouTube" onClick={(e) => { e.preventDefault(); showInfo(t('footer.socialYouTubeTitle'), t('footer.socialYouTubeBody'), '🎬'); }}>🎬</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('footer.ourCompany')}</h4>
          <ul>
            <li><a href="#quienes-somos" onClick={(e) => { e.preventDefault(); showInfo(t('footer.whoWeAre'), t('footer.aboutBody'), '🏢'); }}>{t('footer.whoWeAre')}</a></li>
            <li><a href="#skyteam" onClick={(e) => { e.preventDefault(); showInfo(t('footer.skyteam'), t('footer.skyteamBody'), '🌐'); }}>{t('footer.skyteam')}</a></li>
            <li><a href="#empleo" onClick={(e) => { e.preventDefault(); showInfo(t('footer.workWithUs'), t('footer.workWithUsBody'), '💼'); }}>{t('footer.workWithUs')}</a></li>
            <li><a href="#sostenibilidad" onClick={(e) => { e.preventDefault(); showInfo(t('footer.sustainability'), t('footer.sustainabilityBody'), '🌱'); }}>{t('footer.sustainability')}</a></li>
            <li><a href="#prensa" onClick={(e) => { e.preventDefault(); showInfo(t('footer.pressRoom'), t('footer.pressRoomBody'), '📰'); }}>{t('footer.pressRoom')}</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('footer.passengerServices')}</h4>
          <ul>
            <li><Link to="/">{t('footer.bookFlights')}</Link></li>
            <li><a href="#checkin" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-checkin')); }}>{t('footer.onlineCheckin')}</a></li>
            <li><a href="#estado-vuelo" onClick={(e) => { e.preventDefault(); showInfo(t('footer.flightStatus'), t('footer.flightStatusBody'), '🛫'); }}>{t('footer.flightStatus')}</a></li>
            <li><a href="#equipaje" onClick={(e) => { e.preventDefault(); showInfo(t('footer.baggagePolicy'), t('footer.baggagePolicyBody'), '🧳'); }}>{t('footer.baggagePolicy')}</a></li>
            <li><a href="#asientos" onClick={(e) => { e.preventDefault(); showInfo(t('footer.seatSelection'), t('footer.seatSelectionBody'), '💺'); }}>{t('footer.seatSelection')}</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('footer.helpCenter')}</h4>
          <ul>
            <li><a href="#centro-ayuda" onClick={(e) => { e.preventDefault(); showInfo(t('footer.helpCenter'), t('footer.helpCenterBody'), '📞'); }}>{t('footer.helpCenter')}</a></li>
            <li><a href="#faqs" onClick={(e) => { e.preventDefault(); showInfo(t('footer.faqs'), t('footer.faqsBody'), '❓'); }}>{t('footer.faqs')}</a></li>
            <li><a href="#necesidades-especiales" onClick={(e) => { e.preventDefault(); showInfo(t('footer.specialAssistance'), t('footer.specialAssistanceBody'), '♿'); }}>{t('footer.specialAssistance')}</a></li>
            <li><a href="#reclamaciones" onClick={(e) => { e.preventDefault(); showInfo(t('footer.claims'), t('footer.claimsBody'), '📝'); }}>{t('footer.claims')}</a></li>
            <li><a href="#contacto" onClick={(e) => { e.preventDefault(); showInfo(t('footer.contact'), t('footer.contactBody'), '✉️'); }}>{t('footer.contact')}</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>{t('footer.copyright')}</p>
          <div className="footer-legal-links">
            <a href="#privacidad" onClick={(e) => { e.preventDefault(); showInfo(t('footer.privacyPolicy'), t('footer.privacyPolicyBody'), '🔒'); }}>{t('footer.privacyPolicy')}</a>
            <a href="#terminos" onClick={(e) => { e.preventDefault(); showInfo(t('footer.terms'), t('footer.termsBody'), '📄'); }}>{t('footer.terms')}</a>
            <a href="#cookies" onClick={(e) => { e.preventDefault(); showInfo(t('footer.cookies'), t('footer.cookiesBody'), '🍪'); }}>{t('footer.cookies')}</a>
            <a href="#derechos" onClick={(e) => { e.preventDefault(); showInfo(t('footer.rights'), t('footer.rightsBody'), '⚖️'); }}>{t('footer.rights')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
