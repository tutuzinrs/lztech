import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '../lib/data'
import { categoryLabel } from '../lib/categories'
import { brl } from '../lib/format'
import { useCart } from '../context/CartContext'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'

export default function ProductPage() {
  const { id } = useParams()
  const products = useProducts()
  const { addItem, openCart, openCheckout } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()

  const product = products.find((p) => p.id === id)

  if (!product || !product.active) {
    return (
      <div className="container page">
        <div className="empty">
          <span>😕</span>
          <h3>Produto não encontrado</h3>
          <p>Ele pode ter sido removido do catálogo.</p>
          <Link className="btn btn-primary" to="/catalogo">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  const outOfStock = Number(product.stock) <= 0
  const related = products
    .filter((p) => p.active && p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAdd = () => {
    addItem(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const buyNow = () => {
    addItem(product.id, qty)
    openCheckout()
  }

  return (
    <div className="container page">
      <nav className="breadcrumb">
        <Link to="/">Início</Link> / <Link to="/catalogo">Catálogo</Link> /{' '}
        <Link to={`/catalogo?cat=${product.category}`}>{categoryLabel(product.category)}</Link> /{' '}
        <span>{product.name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp-media">
          <ProductImage product={product} className="pdp-img" />
          {product.badge && <span className="badge">{product.badge}</span>}
        </div>

        <div className="pdp-info">
          <span className="card-cat">{categoryLabel(product.category)}</span>
          <h1>{product.name}</h1>

          <div className="pdp-price">
            <strong>{brl(product.price)}</strong>
            {product.oldPrice ? <s>{brl(product.oldPrice)}</s> : null}
          </div>

          <p className="pdp-desc">{product.description}</p>

          <div className="pdp-meta">
            <span className={outOfStock ? 'stock out' : 'stock'}>
              {outOfStock
                ? 'Sem estoque no momento'
                : `Disponível — ${product.stock} em estoque`}
            </span>
            <span className="pdp-installment">
              ou 3x de {brl(product.price / 3)} no cartão
            </span>
          </div>

          <div className="pdp-actions">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir">
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Aumentar">
                +
              </button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAdd} disabled={outOfStock}>
              {added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
            </button>
          </div>

          <button className="btn btn-dark btn-lg btn-full" onClick={buyNow} disabled={outOfStock}>
            Comprar agora
          </button>

          <button className="link-cart" onClick={openCart}>
            Ver carrinho
          </button>

          <ul className="pdp-perks">
            <li>🚀 Enviamos no mesmo dia para a região</li>
            <li>🛡️ Produto testado e com garantia</li>
            <li>📲 Finalize o pedido pelo WhatsApp</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Você também pode gostar</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
