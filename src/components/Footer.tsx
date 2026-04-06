import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__brand">
          <span className="footer__brand-script">Cake</span>
          <span className="footer__brand-serif"> Emi</span>
        </p>
          <p className="footer__brand-script"><a href="https://www.instagram.com/cake_eemi">
            <span className="footer__brand-serif">Suis moi sur </span>
            <span className="footer__brand-script"> Instagram</span></a></p>
        <p className="footer__copy">© {new Date().getFullYear()} cake_eemi. All rights reserved.</p>
      </div>
    </footer>
  );
}
