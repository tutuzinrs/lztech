import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from './api'

const StoreDataContext = createContext(null)

const FALLBACK_SETTINGS = {
  storeName: 'LZ Tech',
  tagline: '',
  whatsapp: '',
  address: '',
  city: '',
  instagram: '',
  hours: '',
  deliveryFee: 0,
  deliveryFreeKm: 5,
  deliveryBaseFee: 5,
  deliveryPerKm: 2,
}

export function DataProvider({ children }) {
  const [state, setState] = useState({
    products: [],
    banners: [],
    settings: FALLBACK_SETTINGS,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    try {
      const [products, banners, settings] = await Promise.all([
        api.products({ active: 'true' }),
        api.banners({ active: 'true' }),
        api.settings(),
      ])
      setState({ products, banners, settings, loading: false, error: null })
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error: error.message }))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <StoreDataContext.Provider value={{ ...state, reload: load }}>
      {children}
    </StoreDataContext.Provider>
  )
}

export function useStoreData() {
  const ctx = useContext(StoreDataContext)
  if (!ctx) throw new Error('useStoreData deve ser usado dentro de DataProvider')
  return ctx
}

export const useProducts = () => useStoreData().products
export const useBanners = () => useStoreData().banners
export const useSettings = () => useStoreData().settings || FALLBACK_SETTINGS
