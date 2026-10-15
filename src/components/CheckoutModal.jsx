import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useSettings } from '../lib/data'
import { api } from '../lib/api'
import { brl } from '../lib/format'
import { orderMessage, whatsappLink } from '../lib/orders'

const PAYMENTS = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito']

const emptyForm = {
  name: '',
  phone: '',
  delivery: 'entrega',
  address: '',
  city: '',
  payment: 'Pix',
  notes: '',
}

export default function CheckoutModal() {
  const { checkout, closeCheckout, items, subtotal, clear } = useCart()
  const settings = useSettings()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)
  const [sending, setSending] = useState(false)
  const [quote, setQuote] = useState({ loading: false, fee: null, distanceKm: null, error: null })

  const addressKey = `${form.delivery}|${form.address.trim()}|${form.city.trim()}`

  useEffect(() => {
    if (!checkout || form.delivery !== 'entrega' || form.address.trim().length < 6) {
      setQuote({ loading: false, fee: null, distanceKm: null, error: null })
      return
    }

    let active = true
    setQuote((q) => ({ ...q, loading: true, error: null }))
    const timer = setTimeout(async () => {
      try {
        const result = await api.geoQuote({ address: form.address, city: form.city })
        if (active) setQuote({ loading: false, fee: result.fee, distanceKm: result.distanceKm, error: null })
      } catch (err) {
        if (active) setQuote({ loading: false, fee: null, distanceKm: null, error: err.message })
      }
    }, 700)

    return () => {
      active = false
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout, addressKey])

  if (!checkout) return null

  const fallbackFee = Number(settings.deliveryBaseFee ?? settings.deliveryFee) || 0
  const shipping =
    form.delivery === 'entrega'
      ? quote.distanceKm != null
        ? Number(quote.fee) || 0
        : quote.error
          ? fallbackFee
          : 0
      : 0
  const total = subtotal + shipping

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const close = () => {
    setDone(null)
    setForm(emptyForm)
    setErrors({})
    setQuote({ loading: false, fee: null, distanceKm: null, error: null })
    closeCheckout()
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Informe seu nome'
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Informe um WhatsApp válido'
    if (form.delivery === 'entrega' && !form.address.trim()) e.address = 'Informe o endereço'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (items.length === 0 || sending) return
    if (!validate()) return

    setSending(true)
    try {
      const order = await api.createOrder({
        customer: form,
        items: items.map((i) => ({ id: i.product.id, qty: i.qty })),
      })

      const url = whatsappLink(settings, orderMessage(order, settings))
      window.open(url, '_blank', 'noopener')
      clear()
      setDone({ order, url })
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="overlay overlay-top" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="success">
            <span className="success-icon">✅</span>
            <h2>Pedido {done.order.number} enviado!</h2>
            <p>
              Abrimos o WhatsApp com o resumo do seu pedido. Se a janela não abriu, use o botão
              abaixo.
            </p>
            <a className="btn btn-primary btn-lg" href={done.url} target="_blank" rel="noreferrer">
              Abrir WhatsApp novamente
            </a>
            <button className="btn btn-ghost" onClick={close}>
              Fechar
            </button>
          </div>
        ) : (
          <form className="checkout" onSubmit={submit}>
            <header className="modal-head">
              <h2>Finalizar pedido</h2>
              <button type="button" className="icon-btn" onClick={close} aria-label="Fechar">
                ✕
              </button>
            </header>

            {items.length === 0 ? (
              <div className="drawer-empty">
                <span>🛒</span>
                <h3>Seu carrinho está vazio</h3>
              </div>
            ) : (
              <div className="checkout-body">
                <div className="checkout-form">
                  <div className="form-grid">
                    <label className="field">
                      <span className="label">Nome completo *</span>
                      <input
                        className={`input ${errors.name ? 'invalid' : ''}`}
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="Como podemos te chamar?"
                      />
                      {errors.name && <small className="error">{errors.name}</small>}
                    </label>

                    <label className="field">
                      <span className="label">Seu WhatsApp *</span>
                      <input
                        className={`input ${errors.phone ? 'invalid' : ''}`}
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                      {errors.phone && <small className="error">{errors.phone}</small>}
                    </label>
                  </div>

                  <div className="field">
                    <span className="label">Como quer receber?</span>
                    <div className="seg">
                      <button
                        type="button"
                        className={form.delivery === 'entrega' ? 'active' : ''}
                        onClick={() => set('delivery', 'entrega')}
                      >
                        🚚 Entrega
                      </button>
                      <button
                        type="button"
                        className={form.delivery === 'retirada' ? 'active' : ''}
                        onClick={() => set('delivery', 'retirada')}
                      >
                        🏬 Retirar na loja
                      </button>
                    </div>
                  </div>

                  {form.delivery === 'entrega' && (
                    <div className="form-grid">
                      <label className="field">
                        <span className="label">Endereço *</span>
                        <input
                          className={`input ${errors.address ? 'invalid' : ''}`}
                          value={form.address}
                          onChange={(e) => set('address', e.target.value)}
                          placeholder="Rua, número, complemento"
                        />
                        {errors.address && <small className="error">{errors.address}</small>}
                      </label>
                      <label className="field">
                        <span className="label">Bairro / Cidade</span>
                        <input
                          className="input"
                          value={form.city}
                          onChange={(e) => set('city', e.target.value)}
                          placeholder="Bairro, cidade"
                        />
                      </label>
                    </div>
                  )}

                  <div className="field">
                    <span className="label">Forma de pagamento</span>
                    <div className="payments">
                      {PAYMENTS.map((p) => (
                        <button
                          type="button"
                          key={p}
                          className={`pay-chip ${form.payment === p ? 'active' : ''}`}
                          onClick={() => set('payment', p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="field">
                    <span className="label">Observações (opcional)</span>
                    <textarea
                      className="input textarea"
                      rows="2"
                      value={form.notes}
                      onChange={(e) => set('notes', e.target.value)}
                      placeholder="Modelo do celular, cor preferida..."
                    />
                  </label>
                </div>

                <aside className="checkout-summary">
                  <h3>Resumo do pedido</h3>
                  <ul>
                    {items.map((i) => (
                      <li key={i.id}>
                        <span>
                          {i.qty}x {i.product.name}
                        </span>
                        <strong>{brl(i.lineTotal)}</strong>
                      </li>
                    ))}
                  </ul>
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>{brl(subtotal)}</span>
                  </div>
                  <div className="summary-line">
                    <span>
                      {form.delivery === 'entrega'
                        ? quote.distanceKm != null
                          ? `Entrega (${quote.distanceKm} km)`
                          : 'Entrega'
                        : 'Retirada'}
                    </span>
                    <span>
                      {form.delivery !== 'entrega'
                        ? 'Grátis'
                        : quote.loading
                          ? 'Calculando...'
                          : quote.distanceKm != null
                            ? shipping > 0
                              ? brl(shipping)
                              : 'Grátis'
                            : quote.error
                              ? brl(fallbackFee)
                              : '—'}
                    </span>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <strong>{brl(total)}</strong>
                  </div>

                  {form.delivery === 'entrega' && quote.error && (
                    <p className="muted small">
                      Não conseguimos calcular a distância automaticamente. O frete será confirmado
                      no WhatsApp.
                    </p>
                  )}
                  {form.delivery === 'entrega' && quote.distanceKm != null && shipping === 0 && (
                    <p className="muted small">🎉 Frete grátis para o seu endereço!</p>
                  )}

                  {errors.form && <p className="error">{errors.form}</p>}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-full"
                    disabled={sending || quote.loading}
                  >
                    {sending ? 'Enviando...' : quote.loading ? 'Calculando frete...' : 'Enviar pedido no WhatsApp'}
                  </button>
                  <p className="drawer-note">
                    Você confirma o pedido e o pagamento diretamente com a loja.
                  </p>
                </aside>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
