import { Link } from 'react-router-dom'
import { useBanners, useProducts, useSettings } from '../lib/data'
import { CATEGORIES } from '../lib/categories'
import ProductCard from '../components/ProductCard'
import { BannerCarousel, SquareBannerRow } from '../components/BannerCarousel'

const BENEFITS = [
  { icon: '🚀', title: 'Entrega rápida', text: 'Enviamos no mesmo dia para a região.' },
  { icon: '🛡️', title: 'Produtos com garantia', text: 'Peças testadas antes de sair.' },
  { icon: '💳', title: 'Pix, cartão ou dinheiro', text: 'Você escolhe como pagar.' },
  { icon: '📲', title: 'Pedido pelo WhatsApp', text: 'Fechou o carrinho, a gente confirma.' },
]

const STEPS = [
  { n: '1', title: 'Escolha os produtos', text: 'Navegue pelo catálogo e adicione ao carrinho.' },
  { n: '2', title: 'Finalize no WhatsApp', text: 'O pedido chega prontinho pra nossa equipe.' },
  { n: '3', title: 'Receba em casa', text: 'Combinamos entrega ou retirada e pronto.' },
]

export default function Home() {
  const products = useProducts()
  const banners = useBanners()
  const settings = useSettings()

  const featured = products.filter((p) => p.featured).slice(0, 8)
  const highlight = featured.length ? featured : products.slice(0, 8)
  const wideBanners = banners.filter((b) => b.format !== 'quadrado')
  const squareBanners = banners.filter((b) => b.format === 'quadrado')

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-tag">📦 Acessórios • Peças • Reparo</span>
            <h1>Tudo para o seu celular em um só lugar</h1>
            <p>
              Carregadores, cabos, fones, películas, capas, telas e carcaças. Monte seu pedido pelo
              site e finalize direto no WhatsApp.
            </p>
            <div className="hero-cta">
              <Link to="/catalogo" className="btn btn-primary btn-lg">
                Ver catálogo
              </Link>
              <a
                className="btn btn-ghost btn-lg"
                href={`https://wa.me/${String(settings.whatsapp || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{products.length}+</strong>
                <span>produtos no catálogo</span>
              </div>
              <div>
                <strong>{CATEGORIES.length}</strong>
                <span>categorias</span>
              </div>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="float-card f1">⚡</div>
            <div className="float-card f2">🎧</div>
            <div className="float-card f3">🔌</div>
            <div className="float-card f4">🛡️</div>
            <div className="float-card f5">📱</div>
          </div>
        </div>
      </section>

      {wideBanners.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2 className="section-title">Ofertas e novidades</h2>
                <p className="section-sub">Clique e veja os produtos</p>
              </div>
            </div>
            <BannerCarousel banners={wideBanners} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Compre por categoria</h2>
              <p className="section-sub">Encontre rápido o que você precisa</p>
            </div>
            <Link className="link-all" to="/catalogo">
              Ver tudo →
            </Link>
          </div>

          <div className="cat-grid">
            {CATEGORIES.map((cat) => {
              const total = products.filter((p) => p.category === cat.id).length
              return (
                <Link key={cat.id} to={`/catalogo?cat=${cat.id}`} className="cat-card">
                  <span className={`cat-emoji ph-${cat.id}`}>{cat.emoji}</span>
                  <span className="cat-name">{cat.label}</span>
                  <span className="cat-count">{total} itens</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {squareBanners.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2 className="section-title">Destaques</h2>
                <p className="section-sub">Arraste para ver mais</p>
              </div>
            </div>
            <SquareBannerRow banners={squareBanners} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Destaques da loja</h2>
              <p className="section-sub">Os queridinhos dos nossos clientes</p>
            </div>
            <Link className="link-all" to="/catalogo">
              Ver catálogo completo →
            </Link>
          </div>
          {highlight.length === 0 ? (
            <p className="muted">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="grid">
              {highlight.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="benefits">
        <div className="container benefits-grid">
          {BENEFITS.map((b) => (
            <div key={b.title} className="benefit">
              <span className="benefit-icon">{b.icon}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div>
              <h2 className="section-title">Como comprar</h2>
              <p className="section-sub">Simples, rápido e sem complicação</p>
            </div>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
              <div key={s.n} className="step">
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
