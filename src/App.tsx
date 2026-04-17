import {HashRouter, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Showroom from './pages/Showroom';
import Order from './pages/Order';
import './index.css';
import AuthGate from "./components/AuthGate";

/**
 * Using HashRouter for GitHub Pages compatibility —
 * no server-side rewrite needed for client-side routes.
 */
export default function App() {
    return (
        <AuthGate>
            <HashRouter>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Showroom/>}/>
                    <Route path="/order" element={<Order/>}/>
                </Routes>
                <Footer/>
            </HashRouter>
        </AuthGate>
    );
}
