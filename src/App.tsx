import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Showroom from './pages/Showroom';
import Order from './pages/Order';
import './index.css';

/**
 * Using HashRouter for GitHub Pages compatibility —
 * no server-side rewrite needed for client-side routes.
 */
export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Showroom />} />
        <Route path="/order" element={<Order />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}
