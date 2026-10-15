import { useEffect, useRef, useState } from 'react'
import BannerCard from './BannerCard'

export function BannerCarousel({ banners }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = banners.length

  useEffect(() => {
    if (count <= 1 || paused) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000)
    return () => clearInterval(t)
  }, [count, paused])

  if (count === 0) return null

  return (
    <div
      className="banner-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="banner-carousel-viewport">
        <div
          className="banner-carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((banner) => (
            <div className="banner-carousel-slide" key={banner.id}>
              <BannerCard banner={banner} />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            className="banner-carousel-btn prev"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            aria-label="Banner anterior"
          >
            ‹
          </button>
          <button
            className="banner-carousel-btn next"
            onClick={() => setIndex((i) => (i + 1) % count)}
            aria-label="Próximo banner"
          >
            ›
          </button>
          <div className="banner-carousel-dots">
            {banners.map((b, i) => (
              <button
                key={b.id}
                className={`banner-dot ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Ir para banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function SquareBannerRow({ banners }) {
  const ref = useRef(null)

  if (banners.length === 0) return null

  const scrollBy = (dir) => ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

  return (
    <div className="banner-sq-carousel">
      <div className="banner-sq-viewport" ref={ref}>
        {banners.map((banner) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
      </div>
      {banners.length > 2 && (
        <>
          <button
            className="banner-carousel-btn prev"
            onClick={() => scrollBy(-1)}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            className="banner-carousel-btn next"
            onClick={() => scrollBy(1)}
            aria-label="Próximo"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}
