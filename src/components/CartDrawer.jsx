import { useCart } from '../context/CartContext'
import { brl } from '../lib/format'
import ProductImage from './ProductImage'

export default function CartDrawer() {
  const { open, closeCart, items, subtotal, setQty, removeItem, openCheckout, count } = useCart()

  if (!open) return null

  return (
    <div className="overlay" onClick={closeCart}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-head">
          <h2>Seu carrinho {count > 0 && <span>({count})</span>}</h2>
          <button className="icon-btn" onClick={closeCart} aria-label="Fechar">
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <span>🛒</span>
            <h3>Seu carrinho está vazio</h3>
            <p>Adicione produtos para montar seu pedido.</p>
            <button className="btn btn-primary" onClick={closeCart}>
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <ProductImage product={item.product} className="cart-img" />
                  <div className="cart-info">
                    <strong>{item.product.name}</strong>
                    <span className="cart-price">{brl(item.product.price)}</span>
                    <div className="qty qty-sm">
                      <button onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-right">
                    <strong>{brl(item.lineTotal)}</strong>
                    <button className="remove" onClick={() => removeItem(item.id)}>
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="drawer-foot">
              <div className="drawer-total">
                <span>Subtotal</span>
                <strong>{brl(subtotal)}</strong>
              </div>
              <p className="drawer-note">Frete e pagamento combinados no WhatsApp.</p>
              <button className="btn btn-primary btn-lg btn-full" onClick={openCheckout}>
                Finalizar pedido
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
