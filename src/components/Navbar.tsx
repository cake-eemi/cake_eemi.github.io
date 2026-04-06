import {NavLink} from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.jpg';

export default function Navbar() {
    return (
        <header className="navbar">
            <NavLink to="/" className="navbar__brand">
                <img className="img__logo" src={logo} alt="Logo"></img>
                <span className="navbar__brand-script">Cake</span>
                <span className="navbar__brand-serif">Emi</span>
            </NavLink>

            <nav className="navbar__nav">
                <NavLink to="/" className={({isActive}) => `navbar__link ${isActive ? 'active' : ''}`} end>
                    Showroom
                </NavLink>
                <NavLink to="/order" className={({isActive}) => `navbar__link ${isActive ? 'active' : ''}`}>
                    Commande maintenant
                </NavLink>
            </nav>

            <div className="navbar__tagline">Homemade with love</div>
        </header>
    );
}
