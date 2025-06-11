# 🚀 Web Workers vs Main Thread - JSON Processing Demo

Bu proje, büyük JSON dosyalarını (25MB+) işlerken Web Worker'ların Main Thread'e göre avantajlarını gösteren interaktif bir demo uygulamasıdır.

## 🌐 Canlı Demo

- **Ana Sayfa**: https://canbulgay.github.io/web-workers-vs-main-thread/
- **İngilizce**: https://canbulgay.github.io/web-workers-vs-main-thread/?lang=en
- **Türkçe**: https://canbulgay.github.io/web-workers-vs-main-thread/?lang=tr

## ✨ Özellikler

- 📊 **25MB+ Büyük JSON Verisi Oluşturma**: Gerçekçi test verileri
- ⚡ **Web Worker İşleme**: UI'yi bloke etmeden arka planda işleme
- 🐌 **Main Thread İşleme**: UI bloke etkisini gösteren karşılaştırma
- 🧪 **UI Bloke Test Demo**: İşleme sırasında UI'nin responsive olup olmadığını test etme
- 🌍 **Çoklu Dil Desteği**: Türkçe ve İngilizce
- 📈 **Performans Karşılaştırması**: Gerçek zamanlı istatistikler
- 📋 **Veri Önizlemesi**: İşlenen verinin detaylı görünümü

## 🎯 Amaç

Bu demo, Web Worker'ların büyük veri işleme sırasında UI'nin responsive kalmasını nasıl sağladığını göstermek için tasarlanmıştır. Kullanıcılar:

1. Büyük JSON verisi oluşturabilir veya yükleyebilir
2. Web Worker ile işleyebilir (UI responsive kalır)
3. Main Thread ile işleyebilir (UI bloke olur)
4. İşleme sırasında test butonlarına tıklayarak farkı gözlemleyebilir

## 🛠️ Teknolojiler

- **HTML5**: Modern web standartları
- **CSS3**: Responsive tasarım ve animasyonlar
- **JavaScript ES6+**: Modern JavaScript özellikleri
- **Web Workers**: Arka plan işleme
- **GitHub Pages**: Ücretsiz hosting

## 📁 Proje Yapısı

```
web-workers-vs-main-thread/
├── index.html          # Ana HTML dosyası
├── styles.css          # CSS stilleri
├── app.js              # Ana uygulama mantığı
├── worker.js           # Web Worker kodu
├── 404.html            # GitHub Pages SPA routing
└── README.md           # Bu dosya
```

## 🚀 Kurulum ve Çalıştırma

### Yerel Geliştirme

1. Projeyi klonlayın:

```bash
git clone https://github.com/canbulgay/web-workers-vs-main-thread.git
cd web-workers-vs-main-thread
```

2. Bir web sunucusu başlatın (CORS için gerekli):

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000
```

3. Tarayıcıda açın:

```
http://localhost:8000
```

### GitHub Pages Deployment

1. Repository'yi GitHub'a push edin
2. Settings > Pages > Source: Deploy from a branch
3. Branch: main, folder: / (root)
4. Save

## 🧪 Kullanım

### 1. Veri Oluşturma/Yükleme

- **"📊 Büyük JSON Verisi Oluştur"**: 25MB+ gerçekçi test verisi oluşturur
- **"📁 JSON Dosyası Yükle"**: Kendi JSON dosyanızı yükleyebilirsiniz

### 2. İşleme Testi

- **"⚡ Web Worker ile İşle"**: UI'yi bloke etmeden arka planda işleme
- **"🐌 Main Thread ile İşle"**: UI'nin bloke olduğunu gösteren işleme

### 3. UI Bloke Testi

İşleme başladıktan sonra test butonlarına tıklayın:

- **Web Worker**: Butonlar responsive kalır ✅
- **Main Thread**: Butonlar bloke olur ⚠️

## 📊 Performans Karşılaştırması

| Özellik           | Web Worker    | Main Thread |
| ----------------- | ------------- | ----------- |
| UI Responsiveness | ✅ Responsive | ⚠️ Bloke    |
| İşleme Hızı       | Hızlı         | Hızlı       |
| Bellek Kullanımı  | Ayrı thread   | Ana thread  |
| Debug Zorluğu     | Orta          | Kolay       |
| Browser Desteği   | Modern        | Tümü        |

## 🔍 Teknik Detaylar

### Web Worker Avantajları

- UI thread'i bloke etmez
- Paralel işleme
- Daha iyi kullanıcı deneyimi

### Web Worker Dezavantajları

- DOM erişimi yok
- Karmaşık mesajlaşma
- Debug zorluğu

### Gerçek Dünya İşlemleri

Demo'da gerçekleştirilen işlemler:

1. **Veri Analizi**: İstatistik hesaplama
2. **Filtreleme**: Aktif kayıtları filtreleme
3. **Sıralama**: Fiyat, rating, yaş bazlı sıralama
4. **Normalizasyon**: Veri standardizasyonu
5. **Doğrulama**: Veri bütünlüğü kontrolü
6. **Gruplandırma**: Kategori bazlı gruplama

## 🌍 Çoklu Dil Desteği

Proje Türkçe ve İngilizce dillerini destekler:

- URL parametresi: `?lang=tr` veya `?lang=en`
- Otomatik dil algılama
- Dinamik içerik güncelleme

## 🔧 Özelleştirme

### Yeni Dil Ekleme

1. `app.js` dosyasındaki `translations` objesine yeni dil ekleyin
2. Dil algılama fonksiyonunu güncelleyin
3. Dil değiştirici butonlarına yeni dil ekleyin

### Worker İşlemlerini Özelleştirme

`worker.js` dosyasındaki `performRealWorldProcessing` fonksiyonunu kendi ihtiyaçlarınıza göre düzenleyebilirsiniz.

## 🐛 Bilinen Sorunlar

- **GitHub Pages SPA Routing**: `/en/` ve `/tr/` path'leri için 404.html fallback kullanılır
- **Worker Yolu**: GitHub Pages'da worker.js yolu dinamik olarak çözülür
- **CORS**: Yerel geliştirmede web sunucusu gerekli

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👨‍💻 Geliştirici

**Can Bulgay**

- GitHub: [@canbulgay](https://github.com/canbulgay)
- LinkedIn: [Can Bulgay](https://linkedin.com/in/canbulgay)

## 🙏 Teşekkürler

- Web Workers API dokümantasyonu
- GitHub Pages hosting
- Modern web standartları

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
