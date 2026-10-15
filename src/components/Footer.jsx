import { Link } from 'react-router-dom'
import { CATEGORIES } from '../lib/categories'
import { useSettings } from '../lib/data'
import Logo from './Logo'

export default function Footer() {
  const settings = useSettings()
  const digits = String(settings.whatsapp || '').replace(/\D/g, '')

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <Logo alt={settings.storeName} className="logo-img-footer" />
          <p>
            {settings.storeName} — {settings.tagline}. Comprou pelo site, finalizou no WhatsApp,
            recebeu rapidinho.
          </p>
        </div>

        <div className="footer-col">
          <h4>Categorias</h4>
          <ul>
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link to={`/catalogo?cat=${c.id}`}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Atendimento</h4>
          <ul>
            <li>
              <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${String(settings.instagram || '').replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>{settings.hours}</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Onde estamos</h4>
          <ul>
            <li>{settings.city}</li>
            <li>Entrega para toda a região</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.</span>
        <span>Pagamento via Pix, dinheiro ou cartão</span>
      </div>
    </footer>
  )
}
