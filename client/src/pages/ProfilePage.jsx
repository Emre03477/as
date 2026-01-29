import { useState, useEffect } from 'react'

export default function ProfilePage({ user }) {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases')
      if (response.ok) {
        const data = await response.json()
        setPurchases(data)
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
    } finally {
      setLoading(false)
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
            Profilim
          </h1>
        </div>

        {/* Profile Info Card */}
        <div className="card mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold mb-6 text-purple-300">Hesap Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Kullanıcı Adı</p>
              <p className="text-white text-lg font-semibold">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">E-posta</p>
              <p className="text-white text-lg font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Minecraft Kullanıcı Adı</p>
              <p className="text-purple-300 text-lg font-semibold font-mono">{user.minecraft_username}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Üyelik Tarihi</p>
              <p className="text-white text-lg font-semibold">
                {new Date(user.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold mb-6 text-purple-300">Satın Alma Geçmişi</h2>
          
          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-gray-400">Henüz bir satın alma işleminiz yok.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Ürün</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Açıklama</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Fiyat</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Durum</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase, index) => (
                    <tr 
                      key={purchase.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="py-4 px-4 text-white font-semibold">{purchase.name}</td>
                      <td className="py-4 px-4 text-gray-400">{purchase.description}</td>
                      <td className="py-4 px-4 text-purple-400 font-semibold">
                        {purchase.price.toFixed(2)} TL
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          purchase.status === 'delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                          purchase.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                          'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                          {purchase.status === 'delivered' ? '✓ Teslim Edildi' :
                           purchase.status === 'pending' ? '⏳ Bekliyor' :
                           '✗ Başarısız'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {new Date(purchase.created_at).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl mb-2">📊</div>
            <p className="text-3xl font-bold text-purple-400">{purchases.length}</p>
            <p className="text-gray-400 mt-2">Toplam Alışveriş</p>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="text-4xl mb-2">💰</div>
            <p className="text-3xl font-bold text-purple-400">
              {purchases.reduce((sum, p) => sum + p.price, 0).toFixed(2)} TL
            </p>
            <p className="text-gray-400 mt-2">Toplam Harcama</p>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-4xl mb-2">✅</div>
            <p className="text-3xl font-bold text-purple-400">
              {purchases.filter(p => p.status === 'delivered').length}
            </p>
            <p className="text-gray-400 mt-2">Başarılı Teslimat</p>
          </div>
        </div>
      </div>
    </div>
  )
}
