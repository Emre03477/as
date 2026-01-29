# Minecraft Sunucu Mağaza Sitesi

Modern ve kullanıcı dostu bir Minecraft sunucu mağaza sitesi. WebSender entegrasyonu ile otomatik ürün teslimi.

## Özellikler

- ✅ Kullanıcı Kaydı ve Girişi
- ✅ Güvenli Şifre Saklama (bcrypt)
- ✅ Ürün Mağazası
- ✅ Otomatik Ürün Teslimi (WebSender)
- ✅ Kullanıcı Profili
- ✅ Satın Alma Geçmişi
- ✅ Responsive Tasarım
- ✅ Modern ve Çekici Arayüz

## Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- WebSender Plugin (Minecraft sunucunuzda)

## Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/Emre03477/as.git
cd as
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Yapılandırma dosyasını düzenleyin:**

`config.json` dosyasını açın ve ayarları yapın:

```json
{
  "server": {
    "port": 3000,
    "sessionSecret": "güvenli-bir-anahtar-buraya"
  },
  "websender": {
    "enabled": true,
    "host": "localhost",
    "port": 4567,
    "endpoint": "/api/execute"
  },
  "minecraft": {
    "serverName": "Sunucunuzun Adı",
    "serverIp": "play.yourserver.com"
  }
}
```

4. **Sunucuyu başlatın:**
```bash
npm start
```

Geliştirme modu için (otomatik yeniden başlatma):
```bash
npm run dev
```

Site `http://localhost:3000` adresinde çalışacaktır.

## WebSender Kurulumu

### Minecraft Sunucunuza WebSender Plugin Kurulumu:

1. [WebSender](https://www.spigotmc.org/resources/websender.1566/) pluginini indirin
2. `plugins` klasörüne yerleştirin
3. Sunucuyu başlatın
4. `plugins/WebSender/config.yml` dosyasını düzenleyin:

```yaml
host: 0.0.0.0
port: 4567
```

5. Sunucuyu yeniden başlatın

### Güvenlik Notu:
Üretim ortamında WebSender için kimlik doğrulama eklemeniz önerilir.

## Ürün Komutları

Ürünler için kullanabileceğiniz komut örnekleri:

### Rütbe Verme (LuckPerms):
```
lp user {username} parent set vip
```

### İtem Verme:
```
give {username} diamond_sword{Enchantments:[{id:sharpness,lvl:5}]} 1
```

### Çoklu Komutlar (Noktalı virgülle ayırın):
```
give {username} iron_helmet 1; give {username} iron_chestplate 1
```

`{username}` otomatik olarak kullanıcının Minecraft kullanıcı adıyla değiştirilir.

## Veritabanı

Proje SQLite kullanır. `shop.db` dosyası otomatik olarak oluşturulur ve şunları içerir:

- **users**: Kullanıcı hesapları
- **products**: Mağaza ürünleri
- **purchases**: Satın alma kayıtları

## Örnek Ürünler

Uygulama başlatıldığında otomatik olarak örnek ürünler eklenir:

1. **VIP Rank** - 9.99 TL
2. **MVP Rank** - 19.99 TL
3. **Diamond Sword** - 4.99 TL
4. **Starter Kit** - 2.99 TL

## API Endpoints

### Kimlik Doğrulama
- `POST /register` - Yeni kullanıcı kaydı
- `POST /login` - Kullanıcı girişi
- `GET /logout` - Çıkış yap

### Mağaza
- `GET /shop` - Mağaza sayfası (giriş gerekli)
- `POST /purchase` - Ürün satın alma (giriş gerekli)

### Profil
- `GET /profile` - Kullanıcı profili ve satın alma geçmişi

## Özelleştirme

### Yeni Ürün Ekleme

Veritabanına doğrudan veya kodda yeni ürünler ekleyebilirsiniz. `server.js` dosyasında:

```javascript
insertProduct.run(
  'Ürün Adı',
  'Açıklama',
  fiyat,
  'rank', // veya 'item', 'kit'
  'minecraft_komutu {username}'
);
```

### Tema Değiştirme

`public/css/style.css` dosyasını düzenleyerek renkleri ve stili özelleştirebilirsiniz.

## Güvenlik

- Şifreler bcrypt ile hash'lenir
- Session tabanlı kimlik doğrulama
- SQL injection koruması (prepared statements)
- XSS koruması

**Önemli:** Üretim ortamında:
1. `config.json` içindeki `sessionSecret`'i güçlü bir değerle değiştirin
2. HTTPS kullanın
3. Uygun güvenlik duvarı kuralları ekleyin
4. WebSender için kimlik doğrulama ekleyin

## Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Destek

Sorunlar için GitHub Issues kullanın.

## Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için önce bir issue açın.

---

**Not:** Bu proje eğitim amaçlıdır. Üretim ortamında kullanmadan önce ek güvenlik önlemleri almanız önerilir.
