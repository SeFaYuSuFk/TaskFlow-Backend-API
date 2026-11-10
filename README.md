# ⚡ TaskFlow — Görev ve Proje Yönetim Sistemi REST API

![NodeJS](https://img.shields.io/badge/Node.js-v18+-68A063?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend%20Framework-000000?style=for-the-badge&logo=express&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-API%20Tested%20100%25-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![License](https://img.shields.io/badge/Lisans-MIT-blue?style=for-the-badge)

**Bitirme Projesi:** Backend Geliştirme (Node.js & Express.js)  
**Eğitmen:** Musa Kolcuk  
**Kurum:** TNC Group (Software Persona Staj Programı)  
**Geliştirici:** Sefa Yusuf Kütük  
**Durum:** Tamamlandı (%100 Test Kapsamı & Canlı API Paneli)  

---

## 📌 Proje Genel Bakışı

**TaskFlow**, modern yazılım ekiplerinin ve şirketlerin görev, proje, öncelik ve çalışan sorumluluklarını uçtan uca takip edebilmesi için geliştirilmiş kurumsal düzeyde bir **Node.js & Express.js REST API** backend sistemidir.

1. Projemiz olan **NovaStore SQL** veritabanı, 3. Projemiz olan **TaskFlow Web Paneli (React.js)** ve 4. Projemiz olan **NovaStore Mobil (Flutter)** uygulamalarıyla konuşacak standartta bütüncül bir mimaride tasarlanmıştır.

---

## 🏗️ Katmanlı Mimari ve Klasör Organizasyonu

Hocamız Musa Kolcuk'un yönergesindeki MVC / Katmanlı Mimari prensiplerine harfiyen uyulmuştur:

```text
TaskFlow-Backend-API/
├── package.json                             (Bağımlılıklar: Express, Helmet, Cors, Express-Rate-Limit)
├── TaskFlow-Postman-Collection.json         (Postman Entegrasyon Test Koleksiyonu)
├── TaskFlow Proje Raporu.docx               (4 Canlı Test Kanıtı İçeren Resmi Word Raporu)
├── ekran_goruntuleri/                       (API Test Ekran Görüntüleri)
│   ├── Test-1_Canli_Gelistirici_Paneli.png
│   ├── Test-2_Validation_Middleware_400_Hatasi.png
│   ├── Test-3_Guvenlik_Kalkani_401_Yetkisiz_Silme.png
│   └── Test-4_Yeni_Gorev_201_Ekleme_ve_Metrikler.png
└── src/
    ├── server.js                            (Sunucu Giriş Noktası & Güvenlik Kalkanı)
    ├── config/                              (Yapılandırma & Port Ayarları)
    ├── controllers/
    │   ├── taskController.js                (Tam Teşekküllü CRUD ve Sayfalama Operasyonları)
    │   └── reportController.js              (İstatistiksel Özet ve Ciro/Metrik Raporları)
    ├── routes/
    │   ├── taskRoutes.js                    (Görev Endpointleri ve Middleware Zincirleri)
    │   └── reportRoutes.js                  (Raporlama Endpointleri)
    ├── middlewares/
    │   ├── logger.js                        (Tüm İstekleri [METHOD - URL - IP - TARIH] Olarak Kaydeden Logger)
    │   ├── validateTask.js                  (Title, Priority, Assignee 400 Bad Request Doğrulayıcı)
    │   ├── authApiKey.js                    (Kritik İşlemler İçin X-API-KEY Güvenlik Denetimi)
    │   └── errorHandler.js                  (Merkezi Hata Yakalama Middleware'i)
    ├── data/
    │   └── initialTasks.json                (Kalıcı JSON Veritabanı ve Ekosistem Görevleri)
    └── public/
        └── index.html                       (localhost:5000 Canlı Geliştirici & Metrik Test Paneli)
```

---

## 🌟 Projemizin 6 Büyük Değeri

1. **Tam Teşekküllü CRUD Mimarisi:** Görev Ekleme (`POST`), Listeleme (`GET`), Detay Getirme (`GET /:id`), Güncelleme (`PUT /:id`) ve Güvenli Silme (`DELETE /:id`).
2. **Kapsamlı Doğrulama (Validation Middleware):** Zorunlu alanların (başlık min 3 karakter, geçerli öncelik: düşük/orta/yüksek/kritik, geçerli durum: todo/in-progress/completed) eksikliğinde açıklayıcı hata mesajlarıyla `400 Bad Request` fırlatan koruma.
3. **5 Katmanlı Güvenlik Kalkanı:** `Helmet` (HTTP başlık güvenliği), `CORS` (Cross-Origin koruması), `Rate Limiter` (DDoS/Spam koruması: IP başına 15 dakikada 100 istek), `API Key Guard` (`X-API-KEY` ile silme yetkilendirmesi) ve `Merkezi Hata Yakalama (Global Error Handler)`.
4. **Gelişmiş Filtreleme, Canlı Arama ve Sayfalama (Pagination):** `?status=completed`, `?priority=high`, `?search=backend` ve `?page=1&limit=5` query parametreleri ile anlık süzme.
5. **Gelişmiş İstatistik ve Raporlama Servisleri:** `/api/reports/summary`, `/api/reports/completed` ve `/api/reports/pending` uç noktalarıyla toplam iş, biten iş ve sprint metriklerinin canlı hesaplanması.
6. **Canlı Geliştirici & Test Arayüzü (`localhost:5000`):** Postman'e ek olarak tarayıcıdan tek tıkla API uçlarını canlı test edebilen interaktif karanlık mod test paneli.

---

## 📡 API Uç Noktaları (Endpoints) Tablosu

| Metot | Endpoint | Açıklama | Güvenlik / Middleware |
| :---: | :--- | :--- | :---: |
| **GET** | `/api/tasks` | Tüm görevleri listeler (Arama, filtre ve sayfalama destekli) | Logger |
| **GET** | `/api/tasks/:id` | Belirli bir görevin detayını getirir | Logger, 404 Handler |
| **POST** | `/api/tasks` | Yeni görev oluşturur (201 Created) | Logger, Validation Middleware |
| **PUT** | `/api/tasks/:id` | Görev bilgilerini günceller | Logger, Validation Middleware |
| **DELETE** | `/api/tasks/:id` | Görevi sistemden kaldırır | Logger, **API Key Güvenliği (401)** |
| **GET** | `/api/reports/summary` | Genel sistem özet metriklerini getirir | Logger, Report Controller |
| **GET** | `/api/reports/completed` | Tamamlanan görev sayısını ve listesini döner | Logger, Report Controller |
| **GET** | `/api/reports/pending` | Bekleyen görev sayısını ve listesini döner | Logger, Report Controller |

---

## 🚀 Yerel Kurulum ve Çalıştırma

### Adım 1: Bağımlılıkları Yükleyin
```bash
npm install
```

### Adım 2: Sunucuyu Başlatın
```bash
npm start
```

Terminalde şu bildirim belirecektir:
```text
[TaskFlow] Sunucu 5000 portunda basariyla baslatildi!
[TaskFlow] Canli Test Paneli: http://localhost:5000
```

Tarayıcınızdan **`http://localhost:5000`** adresine giderek API durumunu ve metrikleri anında görüntüleyebilirsiniz!

---

## 🧪 Postman ile Test Etme

1. Postman'i açın.
2. `Import` butonuna basarak projedeki **`TaskFlow-Postman-Collection.json`** dosyasını yükleyin.
3. Hazır gelen 8 farklı istek senaryosunu (Create, Read, Update, Delete, Validation 400, Security 401, Reports) tek tıkla test edin.

---

## 👨‍💻 Geliştirici Bilgisi

* **Geliştirici:** Sefa Yusuf Kütük  
* **GitHub:** [@SeFaYuSuFk](https://github.com/SeFaYuSuFk)  
* **Eğitmen:** Musa Kolcuk  
* **Kurum:** TNC Group (Software Persona 2026 Staj Programı)  
