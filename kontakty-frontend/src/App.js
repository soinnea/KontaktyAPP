import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigace from './components/Navigace';
import Dashboard from './pages/Dashboard';
import SeznamKontaktu from './pages/SeznamKontaktu';
import FormularKontaktu from './pages/FormularKontaktu';
import SeznamFirem from './pages/SeznamFirem';
import FormularFirmy from './pages/FormularFirmy';
import SeznamSchuzek from './pages/SeznamSchuzek';
import FormularSchuzky from './pages/FormularSchuzky';

function App() {
  return (
    <BrowserRouter>
      <Navigace />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/kontakty" element={<SeznamKontaktu />} />
        <Route path="/kontakty/novy" element={<FormularKontaktu />} />
        <Route path="/kontakty/:id" element={<FormularKontaktu />} />
        <Route path="/firmy" element={<SeznamFirem />} />
        <Route path="/firmy/nova" element={<FormularFirmy />} />
        <Route path="/firmy/:id" element={<FormularFirmy />} />
        <Route path="/schuzky" element={<SeznamSchuzek />} />
        <Route path="/schuzky/nova" element={<FormularSchuzky />} />
        <Route path="/schuzky/:id" element={<FormularSchuzky />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
