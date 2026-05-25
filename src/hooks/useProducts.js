import { useState, useEffect, useCallback } from 'react'
import { getAllProducts, saveProduct, deleteProduct, seedDefaultProducts } from '../storage/db'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await getAllProducts()
    setProducts(data.sort((a, b) => a.name.localeCompare(b.name)))
  }, [])

  useEffect(() => {
    const init = async () => {
      await seedDefaultProducts()
      await refresh()
      setLoading(false)
    }
    init()
  }, [refresh])

  const addProduct = useCallback(async (product) => {
    const newProduct = { ...product, id: crypto.randomUUID() }
    await saveProduct(newProduct)
    await refresh()
    return newProduct
  }, [refresh])

  const updateProduct = useCallback(async (product) => {
    await saveProduct(product)
    await refresh()
  }, [refresh])

  const removeProduct = useCallback(async (id) => {
    await deleteProduct(id)
    await refresh()
  }, [refresh])

  const adjustQuantity = useCallback(async (id, delta) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    const updated = { ...product, quantity: Math.max(0, product.quantity + delta) }
    await saveProduct(updated)
    await refresh()
  }, [products, refresh])

  const outOfStock = products.filter(p => p.quantity <= 0)
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 3)

  return { products, loading, addProduct, updateProduct, removeProduct, adjustQuantity, outOfStock, lowStock, refresh }
}
