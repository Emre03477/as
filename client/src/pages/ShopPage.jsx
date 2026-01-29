import { useState, useEffect } from 'react'

export default function ShopPage({ user }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (productId) => {
    if (!confirm('Bu ürünü satın almak istediğinizden emin misiniz?')) {
      return
    }

    setPurchasing(productId)
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (data.success) {
        alert('✓ ' + data.message)
        // Optionally reload page or update state
      } else {
        alert('✗ ' + data.message)
      }
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setPurchasing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Mağaza
          </h1>
          <p className="text-xl text-gray-300">
            Hoş geldin, <span className="text-purple-400 font-semibold">{user.username}</span>!
          </p>
          <p className="text-gray-400 mt-2">
            Minecraft: <span className="font-mono text-purple-300">{user.minecraft_username}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="card group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Product Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.type === 'rank' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' :
                  product.type === 'item' ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                  'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                }`}>
                  {product.type === 'rank' ? '👑 RANK' : product.type === 'item' ? '⚔️ ITEM' : '📦 KIT'}
                </span>
              </div>

              {/* Product Info */}
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-400 mb-6 min-h-[60px]">{product.description}</p>

              {/* Price and Purchase Button */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {product.price.toFixed(2)} TL
                  </span>
                </div>
                <button
                  onClick={() => handlePurchase(product.id)}
                  disabled={purchasing === product.id}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing === product.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      İşleniyor...
                    </span>
                  ) : (
                    '🛒 Satın Al'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">Henüz ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  )
}
