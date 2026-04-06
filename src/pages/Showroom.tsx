import { useNavigate } from 'react-router-dom';
import './Showroom.css';

// Placeholder cake gallery items — replace src with your real photos
const GALLERY: { id: number; title: string; description: string; src: string }[] = [
  {
    id: 1,
    title: 'Rose Garden',
    description: 'Vanilla sponge with strawberry compote & fresh rose petals',
    src: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80',
  },
  {
    id: 2,
    title: 'Dark Forest',
    description: 'Chocolate ganache with morello cherries & dark cacao dusting',
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
  },
  {
    id: 3,
    title: 'Lemon Cloud',
    description: 'Zesty lemon sponge with elderflower cream & candied zest',
    src: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80',
  },
  {
    id: 4,
    title: 'Berry Bliss',
    description: 'Vanilla layer cake with mixed berries & whipped mascarpone',
    src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80',
  },
  {
    id: 5,
    title: 'Caramel Reverie',
    description: 'Vanilla base with salted caramel, toasted hazelnuts & gold leaf',
    src: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&q=80',
  },
  {
    id: 6,
    title: 'Lavender Dream',
    description: 'Lemon blueberry cake with lavender buttercream & fresh flowers',
    src: 'https://images.unsplash.com/photo-1568827999250-a8e4ec776dd0?w=600&q=80',
  },
];

export default function Showroom() {
  const navigate = useNavigate();

  return (
    <main className="showroom">
      {/* Hero */}
      <section className="showroom__hero fade-up">
        <p className="showroom__hero-label">Fait maison à Neuchâtel</p>
        <h1 className="showroom__hero-title">
          Chaque gâteau est<br />
          <em>une petite œuvre d'art</em>
        </h1>
        <p className="showroom__hero-sub fade-up fade-up-delay-2">
          Préparé artisanalement avec des ingrédients de saison, pâtissé avec patience et servi avec amour.
        </p>
        <button
          className="showroom__cta fade-up fade-up-delay-3"
          onClick={() => navigate('/order')}
        >
          Commande ton gâteau
        </button>
      </section>

      {/* Divider */}
      <div className="showroom__divider">
        <span className="showroom__divider-line" />
        <span className="showroom__divider-icon">✦</span>
        <span className="showroom__divider-line" />
      </div>

      {/* Gallery */}
      <section className="showroom__gallery">
        <h2 className="showroom__gallery-heading fade-up">Mes Créations</h2>
        <div className="showroom__grid">
          {GALLERY.map((cake, i) => (
            <article
              key={cake.id}
              className="showroom__card fade-up"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="showroom__card-img-wrap">
                <img
                  src={cake.src}
                  alt={cake.title}
                  className="showroom__card-img"
                  loading="lazy"
                />
                <div className="showroom__card-overlay" />
              </div>
              <div className="showroom__card-body">
                <h3 className="showroom__card-title">{cake.title}</h3>
                <p className="showroom__card-desc">{cake.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="showroom__banner fade-up">
        <div className="showroom__banner-inner">
          <h2 className="showroom__banner-title">
            Prêt à commander le gâteau de <em>tes</em> rêves ?
          </h2>
          <p className="showroom__banner-text">
            Choisis ta taille, ta base et tes saveurs... Je m'occupe du reste.
          </p>
          <button
            className="showroom__cta showroom__cta--dark"
            onClick={() => navigate('/order')}
          >
            Commande maintenant →
          </button>
        </div>
      </section>
    </main>
  );
}
