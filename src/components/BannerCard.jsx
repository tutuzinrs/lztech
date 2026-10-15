import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/api'

export default function BannerCard({ banner }) {
  const isExternal = /^https?:\/\//i.test(banner.link || '')
  const isSquare = banner.format === 'quadrado'
  const focusX = Number.isFinite(Number(banner.focusX)) ? Number(banner.focusX) : 0.5
  const focusY = Number.isFinite(Number(banner.focusY)) ? Number(banner.focusY) : 0.5
  const inner = (
    <div className={`banner-art ${isSquare ? 'banner-art-square' : 'banner-art-banner'}`}>
      {banner.image ? (
        <img
          src={assetUrl(banner.image)}
          alt={banner.title}
          loading="lazy"
          style={{
            objectPosition: `${Math.round(focusX * 100)}% ${Math.round(focusY * 100)}%`,
          }}
        />
      ) : (
        <div className="banner-ph">
          <span>{banner.title}</span>
        </div>
      )}
      <div className="banner-overlay">
        <strong>{banner.title}</strong>
        {banner.subtitle && <span>{banner.subtitle}</span>}
      </div>
    </div>
  )

  const cardClass = isSquare ? 'banner-card' : 'banner-card banner-card-wide'

  if (!banner.link) {
    return <div className={cardClass}>{inner}</div>
  }

  if (isExternal) {
    return (
      <a className={cardClass} href={banner.link} target="_blank" rel="noreferrer">
        {inner}
      </a>
    )
  }

  return (
    <Link className={cardClass} to={banner.link}>
      {inner}
    </Link>
  )
}
