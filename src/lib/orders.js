import { brl } from './format'

export function orderMessage(order, settings) {
  const { customer } = order
  const lines = []
  lines.push(`Olá, ${settings.storeName}! Quero finalizar meu pedido 👋`)
  lines.push('')
  lines.push(`*Pedido:* ${order.number}`)
  lines.push(`*Nome:* ${customer.name}`)
  lines.push(`*WhatsApp:* ${customer.phone}`)
  lines.push(
    `*Entrega:* ${
      customer.delivery === 'entrega'
        ? `Entrega - ${customer.address}${customer.city ? `, ${customer.city}` : ''}${
            customer.distanceKm ? ` (${customer.distanceKm} km)` : ''
          }`
        : 'Retirar na loja'
    }`
  )
  lines.push(`*Pagamento:* ${customer.payment}`)
  if (customer.notes) lines.push(`*Observações:* ${customer.notes}`)
  lines.push('')
  lines.push('*Itens do pedido:*')
  order.items.forEach((i) => {
    lines.push(`• ${i.qty}x ${i.name} — ${brl(i.price * i.qty)}`)
  })
  lines.push('')
  lines.push(`*Subtotal:* ${brl(order.subtotal)}`)
  if (order.shipping > 0) lines.push(`*Entrega:* ${brl(order.shipping)}`)
  lines.push(`*Total:* ${brl(order.total)}`)
  return lines.join('\n')
}

export function whatsappLink(settings, text) {
  const digits = String(settings.whatsapp || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
