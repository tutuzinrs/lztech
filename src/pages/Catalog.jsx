import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../lib/data'
import { CATEGORIES } from '../lib/categories'
import ProductCard from '../components/ProductCard'

const SORTS = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'menor', label: 'Menor preço' },
  { id: 'maior', label: 'Maior preço' },
  { id: 'nome', label: 'Nome (A-Z)' },
]

export default function Catalog() {
  const products = useProducts()
  const [params, setParams] = useSearchParams()
  const [onlyStock, setOnlyStock] = useState(false)

  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const sort = params.get('sort') || 'relevancia'

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v)
      else next.delete(k)
    })
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    let out = products.filter((p) => p.active)
    if (cat) out = out.filter((p) => p.category === cat)
    if (q) {
      const term = q.toLowerCase()
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          String(p.description || '').toLowerCase().includes(term)
      )
    }
    if (onlyStock) out = out.filter((p) => Number(p.stock) > 0)

    if (sort === 'menor') out = [...out].sort((a, b) => a.price - b.price)
    else if (sort === 'maior') out = [...out].sort((a, b) => b.price - a.price)
    else if (sort === 'nome') out = [...out].sort((a, b) => a.name.localeCompare(b.name))
    else out = [...out].sort((a, b) => Number(b.featured) - Number(a.featured))

    return out
  }, [products, cat, q, sort, onlyStock])

  const activeCatLabel = CATEGORIES.find((c) => c.id === cat)?.label

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>{activeCatLabel || (q ? `Resultados para "${q}"` : 'Catálogo completo')}</h1>
          <p className="section-sub">
            {list.length} {list.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="pills">
          <button
            className={`pill ${!cat ? 'active' : ''}`}
            onClick={() => update({ cat: '' })}
          >
            Tudo
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`pill ${cat === c.id ? 'active' : ''}`}
              onClick={() => update({ cat: c.id })}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="toolbar-right">
          <label className="check">
            <input
              type="checkbox"
              checked={onlyStock}
              onChange={(e) => setOnlyStock(e.target.checked)}
            />
            Só disponíveis
          </label>
          <select
            className="select"
            value={sort}
            onChange={(e) => update({ sort: e.target.value })}
            aria-label="Ordenar"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {q && (
        <button className="clear-search" onClick={() => update({ q: '' })}>
          Limpar busca “{q}” ✕
        </button>
      )}

      {list.length === 0 ? (
        <div className="empty">
          <span>🔍</span>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente outra busca ou escolha outra categoria.</p>
        </div>
      ) : (
        <div className="grid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
