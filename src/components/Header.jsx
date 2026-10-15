import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSettings } from '../lib/data'
import Logo from './Logo'

export default function Header() {
  const { count, openCart } = useCart()
  const settings = useSettings()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo')
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label={settings.storeName}>
          <Logo alt={settings.storeName} />
        </Link>

        <nav className="nav">
          <NavLink to="/" end>
            Início
          </NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          <a
            href={`https://instagram.com/${String(settings.instagram || '').replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </nav>

        <div className="header-actions">
          <form className="search" onSubmit={submit} role="search">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 4 4"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produto..."
              aria-label="Buscar produto"
            />
          </form>

          <button className="icon-btn cart-btn" onClick={openCart} aria-label="Abrir carrinho">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
