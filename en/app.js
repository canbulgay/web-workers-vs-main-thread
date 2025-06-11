// Ana uygulama dosyası
class JSONProcessor {
  constructor() {
    this.worker = null;
    this.currentData = null;
    this.isProcessing = false;
    this.clickCount = 0;
    this.testStartTime = null;
    this.isTestActive = false;

    this.initializeWorker();
    this.bindEvents();
    this.initializeUITest();
    this.updateUI();
  }

  // Web Worker'ı başlat
  initializeWorker() {
    try {
      this.worker = new Worker("worker.js");
      this.worker.onmessage = (e) => {
        this.handleWorkerMessage(e.data);
      };

      this.worker.onerror = (error) => {
        console.error("Worker hatası:", error);
        this.showError("Web Worker hatası: " + error.message);
      };
    } catch (error) {
      console.error("Worker başlatılamadı:", error);
      this.showError("Web Worker başlatılamadı: " + error.message);
    }
  }

  // Worker mesajlarını işle
  handleWorkerMessage(message) {
    const { type, data, error } = message;

    switch (type) {
      case "worker-ready":
        console.log("Worker hazır:", data.message);
        break;

      case "parse-complete":
        this.handleParseComplete(data);
        break;

      case "process-complete":
        this.handleProcessComplete(data);
        break;

      case "error":
        this.showError(error);
        break;

      default:
        console.log("Bilinmeyen mesaj tipi:", type);
    }
  }

  // Parse tamamlandığında
  handleParseComplete(data) {
    this.isProcessing = false;
    this.isTestActive = false;
    this.currentData = data.parsedData;

    const delayMs = 2000;
    const realProcessingTime = Math.max(0, data.processingTime - delayMs);
    this.updateStats({
      fileSize: this.formatBytes(data.fileSize),
      recordCount: data.recordCount.toLocaleString(),
      processingTime: realProcessingTime.toFixed(2) + "ms",
      processingMethod: "Web Worker",
    });

    this.showDataPreview(data.parsedData);
    this.updateComparisonResults("worker", realProcessingTime, delayMs);
    this.hideProgress();
    this.updateUI();

    // Test tamamlandı
    this.updateTestStatus("ready", "Test Tamamlandı");
    this.updateTestMessage(
      "Web Worker işleme tamamlandı! Butonlara tıklayabildiniz mi?",
      "success"
    );
    this.updateTestButtons(false); // İşleme tamamlandığında butonları devre dışı bırak

    console.log("JSON parse tamamlandı:", data);
  }

  // İşleme tamamlandığında
  handleProcessComplete(data) {
    this.isProcessing = false;

    this.updateStats({
      processingTime: data.processingTime.toFixed(2) + "ms",
      processingMethod: "Web Worker (İşleme)",
    });

    this.showDataPreview(data.processedData);
    this.hideProgress();
    this.updateUI();

    console.log("Veri işleme tamamlandı:", data);
  }

  // Event listener'ları bağla
  bindEvents() {
    document.getElementById("generateData").addEventListener("click", () => {
      this.generateLargeJSON();
    });

    document.getElementById("loadData").addEventListener("click", () => {
      this.loadJSONFile();
    });

    document
      .getElementById("processWithWorker")
      .addEventListener("click", () => {
        this.processWithWorker();
      });

    document
      .getElementById("processMainThread")
      .addEventListener("click", () => {
        this.processInMainThread();
      });
  }

  // Büyük JSON verisi oluştur
  generateLargeJSON() {
    this.showProgress(t("progressWorker"));

    // 5-10MB büyüklüğünde veri oluştur
    const data = this.createLargeDataset();
    const jsonString = JSON.stringify(data);

    this.currentData = jsonString;
    this.hideProgress();
    this.updateUI();

    console.log(
      "JSON verisi oluşturuldu, boyut:",
      this.formatBytes(new Blob([jsonString]).size)
    );
  }

  // Büyük veri seti oluştur
  createLargeDataset() {
    const dataset = [];
    const targetSize = 25 * 1024 * 1024; // ~25MB (daha büyük)
    let currentSize = 0;

    // Farklı veri tipleri
    const cities = [
      "İstanbul",
      "Ankara",
      "İzmir",
      "Bursa",
      "Antalya",
      "Adana",
      "Konya",
      "Gaziantep",
      "Kayseri",
      "Mersin",
      "Diyarbakır",
      "Şanlıurfa",
      "Manisa",
      "Hatay",
      "Balıkesir",
      "Kahramanmaraş",
      "Van",
      "Aydın",
      "Denizli",
      "Sakarya",
      "Muğla",
      "Eskişehir",
      "Tekirdağ",
      "Trabzon",
    ];
    const categories = [
      "Elektronik",
      "Giyim",
      "Kitap",
      "Spor",
      "Ev",
      "Otomobil",
      "Sağlık",
      "Eğitim",
      "Gıda",
      "Kozmetik",
      "Oyuncak",
      "Bahçe",
      "Ofis",
      "Müzik",
      "Sinema",
      "Seyahat",
    ];
    const names = [
      "Ahmet",
      "Ayşe",
      "Mehmet",
      "Fatma",
      "Ali",
      "Zeynep",
      "Mustafa",
      "Elif",
      "Hasan",
      "Emine",
      "Hüseyin",
      "Hatice",
      "İbrahim",
      "Zehra",
      "Murat",
      "Esra",
      "Ömer",
      "Meryem",
      "Yusuf",
      "Sultan",
      "Kemal",
      "Rukiye",
      "Osman",
      "Hanife",
    ];
    const descriptions = [
      "Yüksek kaliteli ürün",
      "Uygun fiyatlı seçenek",
      "Premium kalite",
      "Ekonomik çözüm",
      "Profesyonel kullanım için",
      "Günlük kullanıma uygun",
      "Dayanıklı malzeme",
      "Modern tasarım",
      "Ergonomik yapı",
      "Çevre dostu",
      "Enerji tasarruflu",
      "Akıllı teknoloji",
      "Kompakt boyut",
      "Taşınabilir",
      "Çok fonksiyonlu",
      "Özel tasarım",
    ];

    let id = 1;

    while (currentSize < targetSize) {
      const item = {
        id: id++,
        name: names[Math.floor(Math.random() * names.length)],
        email: `user${id}@example.com`,
        age: Math.floor(Math.random() * 50) + 18,
        city: cities[Math.floor(Math.random() * cities.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.random() * 1000,
        rating: Math.random() * 5,
        description: this.generateRandomDescription(),
        tags: this.generateRandomTags(),
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: Math.floor(Math.random() * 10) + 1,
          active: Math.random() > 0.3,
          priority: Math.floor(Math.random() * 5) + 1,
          department: this.generateRandomDepartment(),
          location: {
            country: "Türkiye",
            region: this.generateRandomRegion(),
            timezone: "Europe/Istanbul",
          },
        },
        coordinates: {
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180,
        },
        // Daha fazla veri ekle
        details: {
          specifications: this.generateSpecifications(),
          reviews: this.generateReviews(),
          images: this.generateImageUrls(),
          documents: this.generateDocuments(),
          history: this.generateHistory(),
        },
        analytics: {
          views: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 1000),
          shares: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 200),
        },
      };

      dataset.push(item);

      // Boyut kontrolü
      const itemSize = JSON.stringify(item).length;
      currentSize += itemSize;
    }

    return dataset;
  }

  // Rastgele açıklama oluştur
  generateRandomDescription() {
    const descriptions = [
      "Yüksek kaliteli ürün",
      "Uygun fiyatlı seçenek",
      "Premium kalite",
      "Ekonomik çözüm",
      "Profesyonel kullanım için",
      "Günlük kullanıma uygun",
      "Dayanıklı malzeme",
      "Modern tasarım",
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  // Rastgele etiketler oluştur
  generateRandomTags() {
    const allTags = [
      "yeni",
      "popüler",
      "indirimli",
      "özel",
      "sınırlı",
      "premium",
      "ekonomik",
      "kaliteli",
      "hızlı",
      "güvenli",
      "kolay",
      "pratik",
      "şık",
      "modern",
      "klasik",
      "trend",
    ];
    const numTags = Math.floor(Math.random() * 4) + 1;
    const tags = [];

    for (let i = 0; i < numTags; i++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }

    return tags;
  }

  // Rastgele departman oluştur
  generateRandomDepartment() {
    const departments = [
      "Satış",
      "Pazarlama",
      "Müşteri Hizmetleri",
      "İnsan Kaynakları",
      "Finans",
      "Bilgi Teknolojileri",
      "Operasyon",
      "Kalite Kontrol",
      "Araştırma",
      "Geliştirme",
    ];
    return departments[Math.floor(Math.random() * departments.length)];
  }

  // Rastgele bölge oluştur
  generateRandomRegion() {
    const regions = [
      "Marmara",
      "Ege",
      "Akdeniz",
      "İç Anadolu",
      "Karadeniz",
      "Doğu Anadolu",
      "Güneydoğu Anadolu",
    ];
    return regions[Math.floor(Math.random() * regions.length)];
  }

  // Rastgele özellikler oluştur
  generateSpecifications() {
    const specs = {};
    const specTypes = [
      "Boyut",
      "Ağırlık",
      "Renk",
      "Materyal",
      "Garanti",
      "Menşei",
    ];

    specTypes.forEach((type) => {
      if (Math.random() > 0.5) {
        specs[type] = this.generateRandomSpecValue(type);
      }
    });

    return specs;
  }

  // Rastgele özellik değeri oluştur
  generateRandomSpecValue(type) {
    const values = {
      Boyut: ["Küçük", "Orta", "Büyük", "XL", "XXL"],
      Ağırlık: ["Hafif", "Orta", "Ağır", "Çok Ağır"],
      Renk: ["Kırmızı", "Mavi", "Yeşil", "Sarı", "Siyah", "Beyaz", "Gri"],
      Materyal: ["Plastik", "Metal", "Ahşap", "Cam", "Kumaş", "Deri"],
      Garanti: ["1 Yıl", "2 Yıl", "3 Yıl", "5 Yıl", "Ömür Boyu"],
      Menşei: ["Türkiye", "Çin", "Almanya", "Japonya", "ABD", "İtalya"],
    };

    return values[type]
      ? values[type][Math.floor(Math.random() * values[type].length)]
      : "Belirtilmemiş";
  }

  // Rastgele yorumlar oluştur
  generateReviews() {
    const reviews = [];
    const numReviews = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < numReviews; i++) {
      reviews.push({
        id: i + 1,
        user: `Kullanıcı${Math.floor(Math.random() * 1000)}`,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: this.generateRandomComment(),
        date: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        helpful: Math.floor(Math.random() * 50),
      });
    }

    return reviews;
  }

  // Rastgele yorum oluştur
  generateRandomComment() {
    const comments = [
      "Çok memnun kaldım, tavsiye ederim.",
      "Kaliteli ürün, fiyatına değer.",
      "Beklediğimden daha iyi çıktı.",
      "Hızlı kargo, güvenilir satıcı.",
      "Ürün tam istediğim gibi.",
      "Kullanımı kolay ve pratik.",
      "Dayanıklı ve uzun ömürlü.",
      "Modern tasarım, şık görünüm.",
      "Performansı çok iyi.",
      "Müşteri hizmetleri çok ilgili.",
    ];

    return comments[Math.floor(Math.random() * comments.length)];
  }

  // Rastgele resim URL'leri oluştur
  generateImageUrls() {
    const images = [];
    const numImages = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numImages; i++) {
      images.push({
        id: i + 1,
        url: `https://example.com/images/product-${Math.floor(
          Math.random() * 1000
        )}.jpg`,
        alt: `Ürün görseli ${i + 1}`,
        size: Math.floor(Math.random() * 1000000) + 50000, // 50KB - 1MB
        type: "image/jpeg",
      });
    }

    return images;
  }

  // Rastgele dokümanlar oluştur
  generateDocuments() {
    const documents = [];
    const docTypes = ["PDF", "DOC", "XLS", "PPT"];
    const numDocs = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numDocs; i++) {
      documents.push({
        id: i + 1,
        name: `Doküman_${i + 1}.${docTypes[
          Math.floor(Math.random() * docTypes.length)
        ].toLowerCase()}`,
        type: docTypes[Math.floor(Math.random() * docTypes.length)],
        size: Math.floor(Math.random() * 5000000) + 100000, // 100KB - 5MB
        url: `https://example.com/documents/doc-${Math.floor(
          Math.random() * 1000
        )}.pdf`,
      });
    }

    return documents;
  }

  // Rastgele geçmiş oluştur
  generateHistory() {
    const history = [];
    const events = [
      "Oluşturuldu",
      "Güncellendi",
      "Onaylandı",
      "Yayınlandı",
      "Arşivlendi",
    ];
    const numEvents = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numEvents; i++) {
      history.push({
        id: i + 1,
        event: events[Math.floor(Math.random() * events.length)],
        date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        user: `Kullanıcı${Math.floor(Math.random() * 100)}`,
        details: `İşlem ${i + 1} tamamlandı.`,
      });
    }

    return history;
  }

  // JSON dosyası yükle
  loadJSONFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.readJSONFile(file);
      }
    };

    input.click();
  }

  // JSON dosyasını oku
  readJSONFile(file) {
    this.showProgress(t("progressMainThread"));

    const reader = new FileReader();

    reader.onload = (e) => {
      this.currentData = e.target.result;
      this.hideProgress();
      this.updateUI();

      console.log(
        "JSON dosyası yüklendi:",
        file.name,
        "Boyut:",
        this.formatBytes(file.size)
      );
    };

    reader.onerror = () => {
      this.showError("Dosya okuma hatası");
      this.hideProgress();
    };

    reader.readAsText(file);
  }

  // Web Worker ile işle
  processWithWorker() {
    if (!this.currentData || this.isProcessing) return;

    this.isProcessing = true;
    this.isTestActive = true;
    this.testStartTime = Date.now();
    this.showProgress(t("progressWorker"));
    this.updateUI();

    // Test durumunu güncelle
    this.updateTestStatus("testing", "Web Worker Test");
    this.updateTestMessage(
      "Web Worker işleme başladı! Butonlara tıklamayı deneyin - UI bloke olmayacak.",
      "info"
    );
    this.updateTestButtons(true); // İşleme başladığında butonları aktif et

    if (this.worker) {
      // currentData'nın tipini kontrol et
      let dataToSend;

      if (typeof this.currentData === "string") {
        // JSON string ise direkt gönder
        dataToSend = this.currentData;
      } else {
        // Object ise JSON string'e çevir
        dataToSend = JSON.stringify(this.currentData);
      }

      this.worker.postMessage({
        type: "parse-json",
        data: dataToSend,
      });
    } else {
      this.showError("Web Worker mevcut değil");
      this.isProcessing = false;
      this.isTestActive = false;
      this.hideProgress();
      this.updateUI();
      this.updateTestStatus("ready", "Hazır");
      this.updateTestButtons(false); // Hata durumunda butonları devre dışı bırak
    }
  }

  // Main Thread'de işle
  processInMainThread() {
    if (!this.currentData || this.isProcessing) return;

    this.isProcessing = true;
    this.isTestActive = true;
    this.testStartTime = Date.now();
    this.showProgress(t("progressMainThread"));
    this.updateUI();

    // Test durumunu güncelle
    this.updateTestStatus("testing", "Main Thread Test");
    this.updateTestMessage(
      "Main Thread işleme başladığında bu butonlara tıklamayı deneyin - UI bloke olabilir.",
      "warning"
    );
    this.updateTestButtons(true); // İşleme başladığında butonları aktif et

    // UI'yi bloke etmemek için setTimeout kullan
    setTimeout(() => {
      try {
        const startTime = performance.now();

        // currentData'nın tipini kontrol et
        let parsedData;
        let dataSize;

        if (typeof this.currentData === "string") {
          // JSON string ise parse et
          parsedData = JSON.parse(this.currentData);
          dataSize = new Blob([this.currentData]).size;
        } else {
          // Zaten object ise direkt kullan
          parsedData = this.currentData;
          dataSize = new Blob([JSON.stringify(this.currentData)]).size;
        }

        // Gerçek dünya işlemleri - veri analizi ve dönüştürme
        this.performRealWorldProcessing(parsedData);

        // Kasıtlı 2 saniye delay - UI bloke etkisini göstermek için
        this.updateProgress(50, t("progressAnalyzing"));
        this.simulateProcessingDelay(2000);
        this.updateProgress(100, t("progressDone"));

        const endTime = performance.now();
        const processingTime = endTime - startTime;
        const delayMs = 2000;
        const realProcessingTime = Math.max(0, processingTime - delayMs);

        this.isProcessing = false;
        this.isTestActive = false;
        this.currentData = parsedData;

        this.updateStats({
          fileSize: this.formatBytes(dataSize),
          recordCount: Array.isArray(parsedData)
            ? parsedData.length.toLocaleString()
            : "1",
          processingTime: realProcessingTime.toFixed(2) + "ms",
          processingMethod: "Main Thread",
        });

        this.showDataPreview(parsedData);
        this.updateComparisonResults("mainThread", realProcessingTime, delayMs);
        this.hideProgress();
        this.updateUI();

        // Test tamamlandı
        this.updateTestStatus("ready", "Test Tamamlandı");
        this.updateTestMessage(
          "Main Thread işleme tamamlandı! Butonlara tıklayabildiniz mi?",
          "success"
        );
        this.updateTestButtons(false); // İşleme tamamlandığında butonları devre dışı bırak

        console.log(
          "Main Thread işleme tamamlandı:",
          realProcessingTime + "ms"
        );
      } catch (error) {
        this.showError("Main Thread işleme hatası: " + error.message);
        this.isProcessing = false;
        this.isTestActive = false;
        this.hideProgress();
        this.updateUI();
        this.updateTestStatus("ready", "Hata");
        this.updateTestMessage("İşleme sırasında hata oluştu!", "error");
        this.updateTestButtons(false); // Hata durumunda butonları devre dışı bırak
      }
    }, 100);
  }

  // UI güncelle
  updateUI() {
    const hasData = !!this.currentData;
    const canProcess = hasData && !this.isProcessing;

    document.getElementById("processWithWorker").disabled = !canProcess;
    document.getElementById("processMainThread").disabled = !canProcess;
  }

  // İstatistikleri güncelle
  updateStats(stats) {
    Object.keys(stats).forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = stats[key];
      }
    });
  }

  // Veri önizlemesi göster
  showDataPreview(data) {
    const previewElement = document.getElementById("dataPreview");

    if (Array.isArray(data)) {
      const preview = data
        .slice(0, 5)
        .map((item) => JSON.stringify(item, null, 2))
        .join("\n\n");

      previewElement.innerHTML = `<pre>${preview}</pre>`;
    } else if (typeof data === "object") {
      previewElement.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else {
      previewElement.innerHTML = `<p>${String(data).substring(0, 500)}...</p>`;
    }
  }

  // Karşılaştırma sonuçlarını güncelle
  updateComparisonResults(type, processingTime, delayTime = 0) {
    const element = document.getElementById(
      type === "worker" ? "workerResults" : "mainThreadResults"
    );

    element.innerHTML = `
      <p><strong>İşleme Süresi:</strong> ${processingTime.toFixed(2)}ms</p>
      <p><strong>Kasıtlı Gecikme:</strong> ${
        delayTime > 0 ? (delayTime / 1000).toFixed(2) + "s" : "-"
      } </p>
      <p><strong>Durum:</strong> ✅ Tamamlandı</p>
      <p><strong>UI Bloke:</strong> ${
        type === "worker" ? "❌ Hayır" : "⚠️ Evet"
      }</p>
    `;
  }

  // Progress göster
  showProgress(message) {
    const container = document.querySelector(".progress-container");
    const text = document.querySelector(".progress-text");

    container.style.display = "block";
    text.textContent = message;

    // Progress bar animasyonu
    const fill = document.querySelector(".progress-fill");
    fill.style.width = "0%";

    setTimeout(() => {
      fill.style.width = "100%";
    }, 100);
  }

  // Progress güncelle
  updateProgress(percentage, message) {
    const container = document.querySelector(".progress-container");
    const text = document.querySelector(".progress-text");
    const fill = document.querySelector(".progress-fill");

    if (container.style.display === "none") {
      container.style.display = "block";
    }

    fill.style.width = percentage + "%";
    text.textContent = message;
  }

  // Progress gizle
  hideProgress() {
    const container = document.querySelector(".progress-container");
    container.style.display = "none";
  }

  // Hata göster
  showError(message) {
    console.error(message);
    alert("Hata: " + message);
  }

  // Byte formatla
  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // UI test işlemleri için ekstra fonksiyonlar
  initializeUITest(disable = true) {
    // Test butonlarına event listener'ları ekle
    const testButtons = ["testButton1", "testButton2", "testButton3"];

    testButtons.forEach((buttonId) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener("click", (e) => {
          this.handleTestButtonClick(e, buttonId);
        });
      }
    });

    // Test durumunu güncelle
    this.updateTestStatus("ready", "Hazır");
    this.updateTestMessage(
      "Main Thread işleme başladığında bu butonlara tıklamayı deneyin!",
      "info"
    );

    if (disable) {
      this.updateTestButtons(false);
    } else {
      this.updateTestButtons(true);
    }
  }

  // Test butonuna tıklama işlemi
  handleTestButtonClick(event, buttonId) {
    const button = event.target;
    const currentTime = new Date().toLocaleTimeString();

    // Tıklama sayısını artır
    this.clickCount++;
    document.getElementById("clickCount").textContent = this.clickCount;
    document.getElementById("lastClickTime").textContent = currentTime;

    // Buton animasyonu
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 300);

    // Test aktifse mesaj göster
    if (this.isTestActive) {
      const processingMethod = this.isProcessing
        ? t("mainThread")
        : t("webWorker");
      const msg = t("testButtonClicked")
        .replace("{method}", processingMethod)
        .replace("{time}", currentTime);
      this.updateTestMessage(msg, "success");
    } else {
      const msg = t("testButtonClickedIdle").replace("{time}", currentTime);
      this.updateTestMessage(msg, "info");
    }

    console.log(`Test butonu tıklandı: ${buttonId} - ${currentTime}`);
  }

  // Test durumunu güncelle
  updateTestStatus(status, text) {
    const statusElement = document.getElementById("testStatus");
    if (statusElement) {
      let statusText = text;
      if (status === "ready") statusText = t("testStatusReady");
      else if (status === "testing") statusText = t("testStatusTesting");
      else if (status === "error") statusText = t("testStatusError");
      statusElement.textContent = statusText;
      statusElement.className = "status-value " + status;
    }
  }

  // Test mesajını güncelle
  updateTestMessage(message, type = "info") {
    const messageElement = document.getElementById("testMessage");
    if (messageElement) {
      let msg = message;
      if (
        message ===
          "Main Thread işleme başladığında bu butonlara tıklamayı deneyin!" ||
        message === t("testMessageMainThread")
      ) {
        msg = t("testMessageMainThread");
      } else if (
        message ===
          "Web Worker işleme başladı! Butonlara tıklamayı deneyin - UI bloke olmayacak." ||
        message === t("testMessageWorker")
      ) {
        msg = t("testMessageWorker");
      } else if (
        message ===
          "Main Thread işleme tamamlandı! Butonlara tıklayabildiniz mi?" ||
        message === t("testMessageMainThreadDone")
      ) {
        msg = t("testMessageMainThreadDone");
      } else if (
        message ===
          "Web Worker işleme tamamlandı! Butonlara tıklayabildiniz mi?" ||
        message === t("testMessageWorkerDone")
      ) {
        msg = t("testMessageWorkerDone");
      } else if (
        message ===
          "Main Thread işleme başladığında bu butonlara tıklamayı deneyin - UI bloke olabilir." ||
        message === t("testMessageMainThreadBlock")
      ) {
        msg = t("testMessageMainThreadBlock");
      }
      messageElement.innerHTML = `<p>${msg}</p>`;
      messageElement.className = "test-message " + type;
    }
  }

  // Test butonlarının durumunu güncelle
  updateTestButtons(enable = false) {
    const testButtons = ["testButton1", "testButton2", "testButton3"];

    testButtons.forEach((buttonId) => {
      const button = document.getElementById(buttonId);
      if (button) {
        if (enable) {
          // İşleme başladığında butonları aktif et
          button.classList.remove("blocked");
          button.disabled = false;
        } else {
          // Hazır durumda butonları devre dışı bırak
          button.classList.add("blocked");
          button.disabled = true;
        }
      }
    });
  }

  // Gerçek dünya işlemleri - veri analizi ve dönüştürme
  performRealWorldProcessing(data) {
    if (!Array.isArray(data)) return;

    // 1. Veri Analizi - İstatistikler hesaplama
    this.calculateDataStatistics(data);

    // 2. Veri Filtreleme ve Sıralama
    this.filterAndSortData(data);

    // 3. Veri Dönüştürme ve Normalizasyon
    this.transformAndNormalizeData(data);

    // 4. Veri Doğrulama ve Temizleme
    this.validateAndCleanData(data);

    // 5. Veri Gruplandırma ve Kategorilendirme
    this.groupAndCategorizeData(data);
  }

  // Veri istatistikleri hesaplama
  calculateDataStatistics(data) {
    const stats = {
      totalRecords: data.length,
      averagePrice: 0,
      priceRange: { min: Infinity, max: -Infinity },
      categoryDistribution: {},
      cityDistribution: {},
      ageDistribution: { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 },
      ratingStats: { average: 0, distribution: {} },
    };

    let totalPrice = 0;
    let totalRating = 0;
    let validPrices = 0;
    let validRatings = 0;

    data.forEach((item) => {
      // Fiyat istatistikleri
      if (item.price && typeof item.price === "number") {
        totalPrice += item.price;
        validPrices++;
        stats.priceRange.min = Math.min(stats.priceRange.min, item.price);
        stats.priceRange.max = Math.max(stats.priceRange.max, item.price);
      }

      // Kategori dağılımı
      if (item.category) {
        stats.categoryDistribution[item.category] =
          (stats.categoryDistribution[item.category] || 0) + 1;
      }

      // Şehir dağılımı
      if (item.city) {
        stats.cityDistribution[item.city] =
          (stats.cityDistribution[item.city] || 0) + 1;
      }

      // Yaş dağılımı
      if (item.age) {
        if (item.age >= 18 && item.age <= 25) stats.ageDistribution["18-25"]++;
        else if (item.age >= 26 && item.age <= 35)
          stats.ageDistribution["26-35"]++;
        else if (item.age >= 36 && item.age <= 45)
          stats.ageDistribution["36-45"]++;
        else if (item.age > 45) stats.ageDistribution["46+"]++;
      }

      // Rating istatistikleri
      if (item.rating && typeof item.rating === "number") {
        totalRating += item.rating;
        validRatings++;
        const ratingKey = Math.floor(item.rating).toString();
        stats.ratingStats.distribution[ratingKey] =
          (stats.ratingStats.distribution[ratingKey] || 0) + 1;
      }
    });

    // Ortalama hesaplamaları
    if (validPrices > 0) stats.averagePrice = totalPrice / validPrices;
    if (validRatings > 0)
      stats.ratingStats.average = totalRating / validRatings;

    // İstatistikleri veriye ekle
    data.statistics = stats;
  }

  // Veri filtreleme ve sıralama
  filterAndSortData(data) {
    // Aktif kayıtları filtrele
    const activeRecords = data.filter(
      (item) => item.metadata && item.metadata.active === true
    );

    // Fiyata göre sırala (yüksekten düşüğe)
    const sortedByPrice = [...data].sort(
      (a, b) => (b.price || 0) - (a.price || 0)
    );

    // Rating'e göre sırala (yüksekten düşüğe)
    const sortedByRating = [...data].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );

    // Yaşa göre sırala
    const sortedByAge = [...data].sort((a, b) => (a.age || 0) - (b.age || 0));

    // Filtrelenmiş ve sıralanmış verileri ekle
    data.filteredData = {
      activeRecords: activeRecords,
      topPriced: sortedByPrice.slice(0, 100),
      topRated: sortedByRating.slice(0, 100),
      byAge: sortedByAge,
    };
  }

  // Veri dönüştürme ve normalizasyon
  transformAndNormalizeData(data) {
    data.forEach((item) => {
      // Fiyat normalizasyonu (0-1 arası)
      if (item.price && data.statistics) {
        const priceRange =
          data.statistics.priceRange.max - data.statistics.priceRange.min;
        if (priceRange > 0) {
          item.normalizedPrice =
            (item.price - data.statistics.priceRange.min) / priceRange;
        }
      }

      // Rating normalizasyonu (0-1 arası)
      if (item.rating) {
        item.normalizedRating = item.rating / 5;
      }

      // Yaş kategorisi
      if (item.age) {
        if (item.age < 25) item.ageCategory = "Genç";
        else if (item.age < 35) item.ageCategory = "Orta Yaş";
        else if (item.age < 50) item.ageCategory = "Yetişkin";
        else item.ageCategory = "Yaşlı";
      }

      // Fiyat kategorisi
      if (item.price) {
        if (item.price < 100) item.priceCategory = "Ekonomik";
        else if (item.price < 500) item.priceCategory = "Orta Segment";
        else if (item.price < 1000) item.priceCategory = "Yüksek Segment";
        else item.priceCategory = "Premium";
      }
    });
  }

  // Veri doğrulama ve temizleme
  validateAndCleanData(data) {
    const validationResults = {
      totalRecords: data.length,
      validRecords: 0,
      invalidRecords: 0,
      errors: [],
    };

    data.forEach((item, index) => {
      let isValid = true;
      const errors = [];

      // Gerekli alanları kontrol et
      if (!item.name || item.name.trim() === "") {
        errors.push("İsim eksik");
        isValid = false;
      }

      if (!item.email || !this.isValidEmail(item.email)) {
        errors.push("Geçersiz email");
        isValid = false;
      }

      if (!item.age || item.age < 0 || item.age > 120) {
        errors.push("Geçersiz yaş");
        isValid = false;
      }

      if (!item.price || item.price < 0) {
        errors.push("Geçersiz fiyat");
        isValid = false;
      }

      // Sonuçları kaydet
      item.validation = {
        isValid: isValid,
        errors: errors,
      };

      if (isValid) {
        validationResults.validRecords++;
      } else {
        validationResults.invalidRecords++;
        validationResults.errors.push({
          index: index,
          errors: errors,
        });
      }
    });

    data.validationResults = validationResults;
  }

  // Email doğrulama
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Veri gruplandırma ve kategorilendirme
  groupAndCategorizeData(data) {
    const groupedData = {
      byCategory: {},
      byCity: {},
      byAgeCategory: {},
      byPriceCategory: {},
      byRating: {},
    };

    data.forEach((item) => {
      // Kategoriye göre grupla
      if (item.category) {
        if (!groupedData.byCategory[item.category]) {
          groupedData.byCategory[item.category] = [];
        }
        groupedData.byCategory[item.category].push(item);
      }

      // Şehre göre grupla
      if (item.city) {
        if (!groupedData.byCity[item.city]) {
          groupedData.byCity[item.city] = [];
        }
        groupedData.byCity[item.city].push(item);
      }

      // Yaş kategorisine göre grupla
      if (item.ageCategory) {
        if (!groupedData.byAgeCategory[item.ageCategory]) {
          groupedData.byAgeCategory[item.ageCategory] = [];
        }
        groupedData.byAgeCategory[item.ageCategory].push(item);
      }

      // Fiyat kategorisine göre grupla
      if (item.priceCategory) {
        if (!groupedData.byPriceCategory[item.priceCategory]) {
          groupedData.byPriceCategory[item.priceCategory] = [];
        }
        groupedData.byPriceCategory[item.priceCategory].push(item);
      }

      // Rating'e göre grupla
      if (item.rating) {
        const ratingKey = Math.floor(item.rating).toString();
        if (!groupedData.byRating[ratingKey]) {
          groupedData.byRating[ratingKey] = [];
        }
        groupedData.byRating[ratingKey].push(item);
      }
    });

    data.groupedData = groupedData;
  }

  // Kasıtlı 2 saniye delay - UI bloke etkisini göstermek için
  simulateProcessingDelay(duration) {
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
      // Boş bir döngü ile bekleme
    }
  }
}

// Uygulamayı başlat
document.addEventListener("DOMContentLoaded", () => {
  new JSONProcessor();
});

// --- I18N SİSTEMİ BAŞLANGIÇ ---
const translations = {
  tr: {
    title: "🚀 Web Worker ile Büyük JSON İşleme",
    subtitle: "25MB+ büyüklüğünde JSON dosyasını Web Worker ile parse edin",
    selectLanguage: "Dil Seçin:",
    generateData: "📊 Büyük JSON Verisi Oluştur",
    loadData: "📁 JSON Dosyası Yükle",
    processWithWorker: "⚡ Web Worker ile İşle",
    processMainThread: "🐌 Main Thread ile İşle",
    uiBlockTestTitle: "🧪 UI Bloke Test Demo",
    uiBlockTestDesc:
      "Main Thread işleme sırasında UI'nin bloke olup olmadığını test edin. İşleme başladıktan sonra aşağıdaki butonlara tıklamayı deneyin.",
    testButton1: "🎯 Test Butonu 1",
    testButton2: "🎲 Test Butonu 2",
    testButton3: "⚡ Test Butonu 3",
    testStatusLabel: "Test Durumu:",
    clickCounterLabel: "Tıklama Sayısı:",
    lastClickLabel: "Son Tıklama:",
    testMessageDefault:
      "Main Thread işleme başladığında bu butonlara tıklamayı deneyin!",
    progressText: "İşleniyor...",
    statsTitle: "📈 İstatistikler",
    fileSizeLabel: "Dosya Boyutu:",
    recordCountLabel: "Kayıt Sayısı:",
    processingTimeLabel: "İşleme Süresi:",
    processingMethodLabel: "İşleme Yöntemi:",
    dataPreviewTitle: "📋 İşlenen Veri Önizlemesi",
    dataPreviewPlaceholder: "Veri yüklenmedi...",
    comparisonTitle: "⚡ Performans Karşılaştırması",
    workerTitle: "Web Worker",
    mainThreadTitle: "Main Thread",
    workerNotTested: "Henüz test edilmedi",
    mainThreadNotTested: "Henüz test edilmedi",
    testStatusReady: "Test Tamamlandı",
    testStatusTesting: "Test Devam Ediyor",
    testStatusError: "Hata",
    testMessageMainThread:
      "Main Thread işleme başladığında bu butonlara tıklamayı deneyin!",
    testMessageWorker:
      "Web Worker işleme başladı! Butonlara tıklamayı deneyin - UI bloke olmayacak.",
    testMessageMainThreadDone:
      "Main Thread işleme tamamlandı! Butonlara tıklayabildiniz mi?",
    testMessageWorkerDone:
      "Web Worker işleme tamamlandı! Butonlara tıklayabildiniz mi?",
    testButtonClicked:
      "✅ Buton tıklandı! ({method} işleme sırasında) - {time}",
    testButtonClickedIdle:
      "🎯 Test butonu tıklandı! ({time}) - İşleme başlatın ve tekrar deneyin.",
    mainThread: "Main Thread",
    webWorker: "Web Worker",
    progressMainThread: "Main Thread'de işleniyor...",
    progressWorker: "Web Worker ile işleniyor...",
    progressAnalyzing: "Veri analizi tamamlandı, işleme devam ediyor...",
    progressDone: "İşleme tamamlandı!",
    testMessageMainThreadBlock:
      "Main Thread işleme başladığında bu butonlara tıklamayı deneyin - UI bloke olabilir.",
  },
  en: {
    title: "🚀 Big JSON Processing with Web Worker",
    subtitle: "Parse a 25MB+ JSON file with a Web Worker",
    selectLanguage: "Select Language:",
    generateData: "📊 Generate Large JSON Data",
    loadData: "📁 Load JSON File",
    processWithWorker: "⚡ Process with Web Worker",
    processMainThread: "🐌 Process on Main Thread",
    uiBlockTestTitle: "🧪 UI Block Test Demo",
    uiBlockTestDesc:
      "Test if the UI is blocked during Main Thread processing. After starting, try clicking the buttons below.",
    testButton1: "🎯 Test Button 1",
    testButton2: "🎲 Test Button 2",
    testButton3: "⚡ Test Button 3",
    testStatusLabel: "Test Status:",
    clickCounterLabel: "Click Count:",
    lastClickLabel: "Last Click:",
    testMessageDefault:
      "Try clicking these buttons when Main Thread processing starts!",
    progressText: "Processing...",
    statsTitle: "📈 Statistics",
    fileSizeLabel: "File Size:",
    recordCountLabel: "Record Count:",
    processingTimeLabel: "Processing Time:",
    processingMethodLabel: "Processing Method:",
    dataPreviewTitle: "📋 Processed Data Preview",
    dataPreviewPlaceholder: "No data loaded...",
    comparisonTitle: "⚡ Performance Comparison",
    workerTitle: "Web Worker",
    mainThreadTitle: "Main Thread",
    workerNotTested: "Not tested yet",
    mainThreadNotTested: "Not tested yet",
    testStatusReady: "Test Completed",
    testStatusTesting: "Test Running",
    testStatusError: "Error",
    testMessageMainThread:
      "Try clicking these buttons when Main Thread processing starts!",
    testMessageWorker:
      "Web Worker processing started! Try clicking the buttons - UI will not be blocked.",
    testMessageMainThreadDone:
      "Main Thread processing completed! Could you click the buttons?",
    testMessageWorkerDone:
      "Web Worker processing completed! Could you click the buttons?",
    testButtonClicked:
      "✅ Button clicked! (during {method} processing) - {time}",
    testButtonClickedIdle:
      "🎯 Test button clicked! ({time}) - Start processing and try again.",
    mainThread: "Main Thread",
    webWorker: "Web Worker",
    progressMainThread: "Processing on Main Thread...",
    progressWorker: "Processing with Web Worker...",
    progressAnalyzing: "Data analysis complete, continuing processing...",
    progressDone: "Processing complete!",
    testMessageMainThreadBlock:
      "Try clicking these buttons when Main Thread processing starts - UI may be blocked.",
  },
};

function detectLangFromPath() {
  const path = window.location.pathname;
  if (path.startsWith("/en/")) return "en";
  if (path.startsWith("/tr/")) return "tr";
  // fallback: URL'de /en/ veya /tr/ yoksa, browser dili veya tr
  const browserLang = navigator.language.slice(0, 2);
  if (browserLang === "en") return "en";
  return "tr";
}

let currentLang = detectLangFromPath();

function t(key) {
  return translations[currentLang][key] || key;
}

function updateI18nTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateI18nTexts();
});
// --- I18N SİSTEMİ SONU ---
