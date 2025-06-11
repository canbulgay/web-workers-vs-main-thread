# 🚀 Web Worker ile Büyük JSON İşleme Projesi

Bu proje, Web Worker'ların performans avantajlarını göstermek için büyük JSON dosyalarını işleyen bir demo uygulamasıdır.

## 📋 Proje Özellikleri

- **5-10MB büyüklüğünde JSON verisi oluşturma**
- **Web Worker ile JSON parse işlemi**
- **Ana thread ile karşılaştırmalı performans testi**
- **Gerçek zamanlı UI güncellemeleri**
- **Modern ve responsive tasarım**
- **Detaylı performans istatistikleri**

## 🛠️ Teknolojiler

- **HTML5** - Modern web standartları
- **CSS3** - Responsive ve animasyonlu tasarım
- **JavaScript ES6+** - Modern JavaScript özellikleri
- **Web Workers API** - Arka plan işleme
- **File API** - Dosya yükleme işlemleri

## 🚀 Kurulum ve Çalıştırma

### 1. Projeyi İndirin

```bash
git clone https://github.com/canbulgay/web-workers-vs-main-thread
cd web-workers-vs-main-thread
```

### 2. HTTP Sunucusu Başlatın

```bash
# Python 3 ile
python3 -m http.server 8000

# veya Node.js ile
npx http-server

# veya npm script ile
npm start
```

### 3. Tarayıcıda Açın

```
http://localhost:8000
```

## 📖 Kullanım

### 1. Veri Oluşturma

- **"Büyük JSON Verisi Oluştur"** butonuna tıklayın
- Sistem otomatik olarak ~7MB büyüklüğünde test verisi oluşturacak

### 2. Dosya Yükleme

- **"JSON Dosyası Yükle"** butonuna tıklayın
- Kendi JSON dosyanızı seçin (5-10MB önerilen)

### 3. İşleme

- **"Web Worker ile İşle"** - Arka planda işleme
- **"Ana Thread ile İşle"** - UI'yi bloke eden işleme

### 4. Sonuçları İnceleme

- İşleme sürelerini karşılaştırın
- UI bloke durumunu gözlemleyin
- İşlenen verinin önizlemesini görün

## 🔍 Araştırma Soruları ve Cevapları

### 1. SharedWorker nedir? Worker'dan farkı nedir?

**SharedWorker**, birden fazla sekme veya pencere arasında paylaşılabilen bir worker türüdür. Normal Worker'lar her sekme için ayrı oluşturulurken, SharedWorker tüm sekmeler arasında ortak kullanılır.

**Farklar:**

- **Worker**: Her sekme için ayrı instance
- **SharedWorker**: Tüm sekmeler arasında paylaşılan tek instance
- **SharedWorker**: Daha az bellek kullanımı
- **SharedWorker**: Sekmeler arası iletişim mümkün

### 2. Web Worker'da DOM neden kullanılamaz?

Web Worker'lar ayrı thread'lerde çalışır ve DOM'a doğrudan erişimleri yoktur. Bu, thread güvenliği ve performans için tasarlanmıştır.

**Nedenleri:**

- **Thread Güvenliği**: DOM manipülasyonu ana thread'de güvenli
- **Performans**: DOM erişimi maliyetli
- **Mimari**: Worker'lar hesaplama odaklı
- **İletişim**: postMessage ile veri paylaşımı

### 3. Web Worker'lar ne zaman "fazla karmaşık" hale gelir?

Web Worker'lar şu durumlarda karmaşık hale gelebilir:

**Karmaşıklık Faktörleri:**

- Çok fazla worker kullanımı
- Karmaşık mesajlaşma protokolleri
- Bellek yönetimi sorunları
- Debug zorluğu
- Worker yaşam döngüsü yönetimi
- Hata yakalama ve işleme

### 4. Comlink.js nedir? Web Worker'ları daha kolay kullanmak için ne sağlar?

**Comlink.js**, Web Worker'lar arasında nesne referanslarını paylaşmayı ve daha kolay API çağrıları yapmayı sağlayan bir kütüphanedir.

**Sağladığı Avantajlar:**

- **Nesne Referansları**: Karmaşık nesneleri paylaşma
- **Promise Desteği**: Async/await kullanımı
- **Proxy API**: Worker'ları normal nesne gibi kullanma
- **Otomatik Serileştirme**: Manuel postMessage yazmaya gerek yok
- **TypeScript Desteği**: Tip güvenliği

## 📊 Performans Karşılaştırması

### Web Worker Avantajları

- ✅ UI bloke olmaz
- ✅ Arka plan işleme
- ✅ Daha iyi kullanıcı deneyimi
- ✅ Çoklu çekirdek kullanımı

### Ana Thread Avantajları

- ✅ Basit implementasyon
- ✅ Doğrudan DOM erişimi
- ✅ Daha az bellek kullanımı
- ✅ Debug kolaylığı

## 🏗️ Proje Yapısı

```
web-workers-vs-main-thread/
├── index.html          # Ana HTML dosyası
├── styles.css          # CSS stilleri
├── app.js              # Ana JavaScript uygulaması
├── worker.js           # Web Worker dosyası
├── package.json        # Proje konfigürasyonu
└── README.md           # Bu dosya
```

## 🔧 Özelleştirme

### Worker Konfigürasyonu

`worker.js` dosyasında işleme mantığını özelleştirebilirsiniz:

```javascript
// Özel işleme fonksiyonu ekleyin
function customProcess(data) {
  // Özel işleme mantığı
  return processedData;
}
```

### Veri Boyutu Ayarlama

`app.js` dosyasında veri boyutunu değiştirebilirsiniz:

```javascript
const targetSize = 10 * 1024 * 1024; // 10MB
```

## 🐛 Sorun Giderme

### Web Worker Yüklenmiyor

- HTTP sunucusu kullandığınızdan emin olun
- Tarayıcı konsolunu kontrol edin
- CORS ayarlarını kontrol edin

### Büyük Dosyalar Yüklenmiyor

- Tarayıcı bellek limitlerini kontrol edin
- Dosya boyutunu küçültün
- Chunked loading kullanın

## 📈 Gelecek Geliştirmeler

- [ ] SharedWorker desteği
- [ ] Comlink.js entegrasyonu
- [ ] Streaming JSON parsing
- [ ] WebAssembly entegrasyonu
- [ ] Service Worker desteği
- [ ] Offline çalışma modu

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**Not**: Bu proje eğitim amaçlı oluşturulmuştur ve Web Worker'ların performans avantajlarını göstermeyi amaçlamaktadır.
