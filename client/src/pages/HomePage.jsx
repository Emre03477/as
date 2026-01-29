import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function HomePage({ user }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.slice(0, 4)) // Show only 4 products on homepage
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-float">
              Hoş Geldiniz!
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              En iyi Minecraft sunucusuna katılın ve eşsiz deneyimin tadını çıkarın
            </p>
            <div className="flex items-center justify-center space-x-2 text-2xl font-mono bg-black/30 backdrop-blur-md rounded-lg px-6 py-4 w-fit mx-auto">
              <span className="text-purple-400">📍</span>
              <span className="text-white">play.yourserver.com</span>
            </div>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <p className="text-2xl text-purple-300">Hoş geldin, {user.username}! 🎮</p>
                <Link to="/shop" className="btn-primary">
                  Mağazaya Git →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Link to="/register" className="btn-primary">
                  Hemen Kayıt Ol
                </Link>
                <Link to="/login" className="btn-secondary">
                  Giriş Yap
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Neden Bizi Seçmelisiniz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold mb-3 text-purple-300">Profesyonel Sunucu</h3>
              <p className="text-gray-400">7/24 kesintisiz oyun deneyimi ve profesyonel destek</p>
            </div>
            <div className="card group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-purple-300">Hızlı Teslimat</h3>
              <p className="text-gray-400">Satın aldığınız ürünler anında hesabınıza tanımlanır</p>
            </div>
            <div className="card group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold mb-3 text-purple-300">Güvenli Alışveriş</h3>
              <p className="text-gray-400">Tüm işlemleriniz güvenli bir şekilde gerçekleştirilir</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Popüler Ürünler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="card group hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.type === 'rank' ? 'bg-yellow-500/20 text-yellow-400' :
                    product.type === 'item' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {product.type.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 min-h-[60px]">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-400">{product.price.toFixed(2)} TL</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to={user ? "/shop" : "/login"} className="btn-primary">
              Tüm Ürünleri Gör →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center card">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hemen Başla!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Binlerce oyuncunun tercih ettiği sunucuya katılın ve maceraya atılın
          </p>
          {!user && (
            <Link to="/register" className="btn-primary text-lg">
              Ücretsiz Kayıt Ol →
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 Minecraft Server Shop. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
