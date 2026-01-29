import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Zap, Copy, Check, Users } from 'lucide-react'

export default function HomePage({ user }) {
  const [products, setProducts] = useState([])
  const [copied, setCopied] = useState(false)
  const [onlinePlayers, setOnlinePlayers] = useState(127)

  useEffect(() => {
    fetchProducts()
    // Simulate online players count
    const interval = setInterval(() => {
      setOnlinePlayers(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.slice(0, 4))
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const copyServerIp = () => {
    navigator.clipboard.writeText('play.yourserver.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section with Floating Elements */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-bg to-dark-bg"></div>
        
        {/* Floating Minecraft Blocks */}
        <motion.div 
          className="absolute top-20 left-10 w-16 h-16 bg-primary-500/10 rounded-lg"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-20 h-20 bg-primary-400/10 rounded-lg"
          animate={{ y: [0, -25, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-600/10 rounded-lg"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Main Heading with Gradient */}
            <motion.h1 
              className="text-6xl md:text-8xl font-bold gradient-text"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Hoş Geldiniz
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Premium Minecraft deneyiminin tadını çıkarın. En iyi sunucu, en iyi topluluk.
            </motion.p>

            {/* Server IP with Copy Button */}
            <motion.div 
              className="flex items-center justify-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="glass px-6 py-4 rounded-xl flex items-center space-x-3 group hover:scale-105 transition-transform">
                <span className="text-primary-400 text-xl font-mono font-bold">
                  play.yourserver.com
                </span>
                <button 
                  onClick={copyServerIp}
                  className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-primary-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400 group-hover:text-primary-400" />
                  )}
                </button>
              </div>
              
              {/* Online Players Count */}
              <motion.div 
                className="glass px-4 py-4 rounded-xl flex items-center space-x-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse-glow"></div>
                <Users className="w-5 h-5 text-primary-400" />
                <span className="text-white font-semibold">{onlinePlayers}</span>
              </motion.div>
            </motion.div>
            
            {/* CTA Buttons */}
            {user ? (
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.p 
                  className="text-2xl text-primary-300"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  Hoş geldin, <span className="font-bold">{user.username}</span>! 🎮
                </motion.p>
                <Link to="/shop" className="btn-primary inline-flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Mağazaya Git</span>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link to="/register" className="btn-primary inline-flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Hemen Başla</span>
                </Link>
                <Link to="/login" className="btn-secondary">
                  Giriş Yap
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Neden Bizi Seçmelisiniz?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Güvenli Alışveriş', desc: '256-bit SSL şifreleme ile güvenli ödeme' },
              { icon: Zap, title: 'Anında Teslimat', desc: 'Ürünleriniz otomatik olarak hesabınıza tanımlanır' },
              { icon: Users, title: 'Aktif Topluluk', desc: '1000+ aktif oyuncu ile büyük bir topluluk' }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="card card-hover group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <feature.icon className="w-12 h-12 text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 gradient-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Popüler Ürünler
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                className="card card-hover group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
              >
                {product.featured && (
                  <span className="badge badge-featured mb-3">
                    ⭐ Öne Çıkan
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 min-h-[60px]">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold gradient-text">{product.price.toFixed(2)} TL</span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to={user ? "/shop" : "/login"} className="btn-primary inline-flex items-center space-x-2">
              <span>Tüm Ürünleri Gör</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-surface border-t border-dark-border py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 Minecraft Server Shop. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
