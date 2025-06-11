// Web Worker - JSON İşleme
// Bu worker büyük JSON dosyalarını parse eder ve işler

// Worker mesajlarını dinle
self.addEventListener("message", function (e) {
  const { type, data } = e.data;

  switch (type) {
    case "parse-json":
      parseJSON(data);
      break;
    case "process-data":
      processData(data);
      break;
    default:
      self.postMessage({
        type: "error",
        error: "Bilinmeyen mesaj tipi: " + type,
      });
  }
});

// JSON parse işlemi
function parseJSON(jsonString) {
  try {
    const startTime = performance.now();

    // JSON'u parse et
    const parsedData = JSON.parse(jsonString);

    // Gerçek dünya işlemleri - veri analizi ve dönüştürme
    performRealWorldProcessing(parsedData);

    // Kasıtlı 2 saniye delay - adil karşılaştırma için
    simulateProcessingDelay(2000);

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    // Sonuçları Main Thread'e gönder
    self.postMessage({
      type: "parse-complete",
      data: {
        parsedData,
        processingTime,
        recordCount: Array.isArray(parsedData) ? parsedData.length : 1,
        fileSize: new Blob([jsonString]).size,
      },
    });
  } catch (error) {
    self.postMessage({
      type: "error",
      error: "JSON parse hatası: " + error.message,
    });
  }
}

// Kasıtlı delay fonksiyonu
function simulateProcessingDelay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // Boş bir döngü ile bekleme
  }
}

// Gerçek dünya işlemleri - veri analizi ve dönüştürme
function performRealWorldProcessing(data) {
  if (!Array.isArray(data)) return;

  // 1. Veri Analizi - İstatistikler hesaplama
  calculateDataStatistics(data);

  // 2. Veri Filtreleme ve Sıralama
  filterAndSortData(data);

  // 3. Veri Dönüştürme ve Normalizasyon
  transformAndNormalizeData(data);

  // 4. Veri Doğrulama ve Temizleme
  validateAndCleanData(data);

  // 5. Veri Gruplandırma ve Kategorilendirme
  groupAndCategorizeData(data);
}

// Veri istatistikleri hesaplama
function calculateDataStatistics(data) {
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
  if (validRatings > 0) stats.ratingStats.average = totalRating / validRatings;

  // İstatistikleri veriye ekle
  data.statistics = stats;
}

// Veri filtreleme ve sıralama
function filterAndSortData(data) {
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
function transformAndNormalizeData(data) {
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
function validateAndCleanData(data) {
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

    if (!item.email || !isValidEmail(item.email)) {
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
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Veri gruplandırma ve kategorilendirme
function groupAndCategorizeData(data) {
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

// Veri işleme fonksiyonu
function processData(data) {
  try {
    const startTime = performance.now();

    // Veri işleme örnekleri
    let processedData = data;

    // Eğer array ise, bazı işlemler yap
    if (Array.isArray(data)) {
      // İlk 10 kaydı al
      processedData = data.slice(0, 10);

      // Her kayıt için bazı hesaplamalar yap
      processedData = processedData.map((item, index) => {
        if (typeof item === "object" && item !== null) {
          return {
            ...item,
            processedIndex: index,
            processedAt: new Date().toISOString(),
            // Örnek hesaplama
            calculatedValue: Math.random() * 100,
          };
        }
        return item;
      });
    }

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    self.postMessage({
      type: "process-complete",
      data: {
        processedData,
        processingTime,
        originalCount: Array.isArray(data) ? data.length : 1,
        processedCount: Array.isArray(processedData) ? processedData.length : 1,
      },
    });
  } catch (error) {
    self.postMessage({
      type: "error",
      error: "Veri işleme hatası: " + error.message,
    });
  }
}

// Worker başlatıldığında mesaj gönder
self.postMessage({
  type: "worker-ready",
  message: "Web Worker hazır!",
});
