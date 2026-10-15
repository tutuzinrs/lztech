import { Link } from 'react-router-dom'
import { brl } from '../lib/format'
import { categoryLabel } from '../lib/categories'
import ProductImage from './ProductImage'

export default function ProductCard({ product }) {
  const outOfStock = Number(product.stock) <= 0

  return (
    <article className="card">
      <Link to={`/produto/${product.id}`} className="card-media">
        <ProductImage product={product} className="card-img" />
        {product.badge && <span className="badge">{product.badge}</span>}
        {outOfStock && <span className="badge badge-muted">Esgotado</span>}
      </Link>

      <div className="card-body">
        <span className="card-cat">{categoryLabel(product.category)}</span>
        <Link to={`/produto/${product.id}`} className="card-title">
          {product.name}
        </Link>
        <div className="card-price">
          <strong>{brl(product.price)}</strong>
          {product.oldPrice ? <s>{brl(product.oldPrice)}</s> : null}
        </div>
      </div>

      <Link to={`/produto/${product.id}`} className="btn btn-primary card-btn">
        Ver produto
      </Link>
    </article>
  )
}
