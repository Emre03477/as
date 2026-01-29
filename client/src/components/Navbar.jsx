import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User, ShoppingBag, Home } from 'lucide-react'

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-bold text-xl">⚔</span>
            </motion.div>
            <span className="text-xl font-bold gradient-text">
              Minecraft Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-primary-400 transition-colors flex items-center space-x-1"
            >
              <Home className="w-4 h-4" />
              <span>Ana Sayfa</span>
            </Link>
            {user ? (
              <>
                <Link 
                  to="/shop" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center space-x-1"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Mağaza</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>Profilim</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden py-4 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/" 
                className="block px-4 py-3 text-gray-300 hover:bg-dark-hover rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Ana Sayfa
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/shop" 
                    className="block px-4 py-3 text-gray-300 hover:bg-dark-hover rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Mağaza
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-3 text-gray-300 hover:bg-dark-hover rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profilim
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-4 py-3 text-gray-300 hover:bg-dark-hover rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-3 text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
