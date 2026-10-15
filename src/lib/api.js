export const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:4000')

export function assetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${API_URL}${path}`
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    throw new Error((data && data.error) || 'Não foi possível conectar ao servidor.')
  }
  return data
}

const qs = (params = {}) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') search.set(k, v)
  })
  const out = search.toString()
  return out ? `?${out}` : ''
}

export const api = {
  products: (params) => request(`/api/products${qs(params)}`),
  banners: (params) => request(`/api/banners${qs(params)}`),
  settings: () => request('/api/settings'),
  geoQuote: (params) => request(`/api/geo/quote${qs(params)}`),
  createOrder: (payload) => request('/api/orders', { method: 'POST', body: payload }),
}
