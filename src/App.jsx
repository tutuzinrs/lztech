import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductPage from './pages/ProductPage'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import ScrollToTop from './components/ScrollToTop'
import { useStoreData } from './lib/data'

export default function App() {
  const { loading, error, reload } = useStoreData()

  if (loading) {
    return (
      <div className="app">
        <div className="boot">
          <span className="spinner" />
          <p>Carregando a loja...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="boot">
          <span className="boot-icon">📡</span>
          <h2>Não foi possível carregar a loja</h2>
          <p className="muted">{error}</p>
          <p className="muted small">
            Verifique se a API está rodando (npm run dev em lztech_api).
          </p>
          <button className="btn btn-primary" onClick={reload}>
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
    </div>
  )
}
