import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CheckInModal from './components/CheckInModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MisReservas from './pages/MisReservas';
import Admin from './pages/Admin';

import InfoModal from './components/InfoModal';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/mis-reservas" element={<MisReservas />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
          <Footer />
          <CheckInModal />
          <InfoModal />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
