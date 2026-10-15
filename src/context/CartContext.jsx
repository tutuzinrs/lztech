import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from '../lib/data'

const CART_KEY = 'lztech_cart_v1'

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    /* storage indisponível */
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart())
  const [open, setOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const products = useProducts()

  useEffect(() => {
    saveCart(items)
  }, [items])

  const detailed = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.id)
        if (!product) return null
        return { ...item, product, lineTotal: product.price * item.qty }
      })
      .filter(Boolean)
  }, [items, products])

  const count = detailed.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = detailed.reduce((sum, item) => sum + item.lineTotal, 0)

  const addItem = (id, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id)
      if (found) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { id, qty }]
    })
  }

  const setQty = (id, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0)
    )
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])

  const value = {
    items: detailed,
    count,
    subtotal,
    open,
    checkout,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    openCheckout: () => {
      setOpen(false)
      setCheckout(true)
    },
    closeCheckout: () => setCheckout(false),
    addItem,
    setQty,
    removeItem,
    clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}
