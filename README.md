# Vizualizacija Pontifikata Kroz Povijest

## 📋 Opis Projekta

Ova web aplikacija predstavlja interaktivnu vizualizaciju podataka o papinim pontifikatima kroz povijest. Projekt je razvijen kao obavezni zadatak za kolegij **Vizualizacija Podataka** i omogućava korisnicima da istražuju različite aspekte papinstva kroz četiri različite vrste vizualizacija.

### 🎯 Ciljevi Projekta

- **Obrazovni**: Pružiti dublje razumijevanje povijesti papinstva kroz vizualnu analizu
- **Interaktivni**: Omogućiti korisnicima filtriranje i sortiranje podataka u realnom vremenu
- **Responzivni**: Osigurati optimalno korisničko iskustvo na različitim uređajima
- **Tehnološki**: Demonstrirati napredne tehnike web-based vizualizacije podataka

## 🚀 Vrste Vizualizacija

### 1. **Racing Chart (Animirana Vremenska Linija)**
- **Funkcionalnost**: Animirani prikaz top 10 najdužih pontifikata kroz vrijeme
- **Značajke**:
  - Animacija koja prikazuje evoluciju najdužih pontifikata kroz stoljeća
  - Kontrola brzine animacije (50ms - 500ms)
  - Indikatori svetaca (★ simbol)
  - Interaktivni tooltipovi s detaljnim informacijama
  - Legenda s bojama prema nacionalnostima
  - Prikaz trenutne godine i napretka animacije

### 2. **Karta Svijeta (Geografska Distribucija)**
- **Funkcionalnost**: Choropleth mapa prikazuje broj papa po zemljama
- **Značajke**:
  - Boje označavaju intenzitet (broj papa iz određene zemlje)
  - Zoom funkcionalnost za detaljniji pregled
  - Tooltipovi s brojem papa za svaku zemlju
  - Automatsko mapiranje nacionalnosti na moderne države

### 3. **Trajanje Pontifikata (Bar Chart)**
- **Funkcionalnost**: Prikaz trajanja pontifikata u obliku stupčastog grafikona
- **Značajke**:
  - Tri opcije sortiranja: kronološki, po trajanju, abecedno
  - Horizontalno skroliranje za veliki broj podataka
  - Indikatori svetaca (★ simbol)
  - Responzivni prikaz s automatskim skaliranjem

### 4. **Analiza Svetaca (Stacked Bar Chart)**
- **Funkcionalnost**: Analiza svetaca i nesvetaca kroz stoljeća
- **Značajke**:
  - Stacked bar chart s podjelom na svetce/nesvetce
  - Statistike s postocima i brojevima
  - Dinamička legenda
  - Responzivno ponašanje za različite veličine ekrana

## 🎛️ Napredne Funkcionalnosti

### **Inteligentni Sistem Filtriranja**
- **Nacionalnost**: Filtriraj papa po zemlji podrijetla
- **Stoljeće**: Ograniči prikaz na određeno stoljeće
- **Status svetosti**: Prikaži samo svetce, nesvetce ili sve

### **Kontrola Animacije**
- **Pametno Onemogućavanje**: Animacija se automatski onemogućuje kada su aktivni filteri
- **Dinamička Brzina**: Promjena brzine animacije u realnom vremenu
- **Automatsko Zaustavljanje**: Animacija se zaustavlja pri promjeni filtera

### **Responzivni Dizajn**
- **Adaptivne Dimenzije**: Grafikoni se automatski prilagođavaju veličini ekrana
- **Mobilna Optimizacija**: Posebni layouti za manje ekrane
- **Skaliranje Fontova**: Dinamičko prilagođavanje veličine teksta
- **Fleksibilne Legende**: Horizontalni/vertikalni layout ovisno o prostoru

## 🛠️ Tehnološki Stack

### **Frontend Tehnologije**
- **HTML5**: Semantička struktura aplikacije
- **CSS3**: Responzivni dizajn s flexbox i grid layoutom
- **JavaScript (ES6+)**: Moderna JavaScript sintaksa
- **D3.js v7**: Napredna library za vizualizaciju podataka
- **TopoJSON**: Geografski podaci za kartu svijeta

### **Ključne D3.js Komponente**
- **d3.scaleLinear/scaleBand**: Skaliranje podataka
- **d3.axisBottom/axisLeft**: Osi grafikona
- **d3.geoMercator**: Geografske projekcije
- **d3.zoom**: Zoom funkcionalnost karte
- **d3.transition**: Smooth animacije
- **d3.rollup**: Grupiranje i agregacija podataka

### **Dodatne Biblioteke**
- **World Atlas**: Geografski podaci za choropleth mapu
- **CDN**: Optimizirano učitavanje vanjskih biblioteka

## 📁 Struktura Projekta

```
VizualizacijaPodatakaProjekt/
├── index.html              # Glavna HTML stranica
├── main.js                 # Glavna JavaScript logika
├── style.css               # CSS stilovi i responzivni dizajn
├── popes.csv               # Glavni dataset o papama
├── merged_data.csv         # Dodatni podaci o papama
├── README.md               # Dokumentacija projekta
├── DataFrames/             # Dodatni CSV fileovi
│   ├── df_1.csv           # Segmentirani podaci
│   ├── df_2.csv
│   └── ...
├── cleanup.py              # Python skripta za čišćenje podataka
├── merge_csv.py            # Python skripta za spajanje podataka
└── drop_portrait.py        # Python skripta za uklanjanje portreta
```

## 🗄️ Podaci

### **Glavni Podaci (popes.csv)**
- **number**: Redni broj pape
- **name_full**: Puno ime pape
- **canonization**: Status svetosti (Saint/NA)
- **birth**: Datum rođenja
- **start/end**: Početak i kraj pontifikata
- **tenure**: Trajanje pontifikata u godinama
- **age_start/age_end**: Godine na početku/kraju pontifikata

### **Dodatni Podaci (merged_data.csv)**
- **Date_and_Place_of_birth**: Detaljno mjesto rođenja
- **Notes**: Dodatne povijesne bilješke
- **Nacionalnost**: Automatski mapirana iz mjesta rođenja

### **Obrada Podataka**
- **Čišćenje**: Uklanjanje nepotrebnih kolona (portreti)
- **Normalizacija**: Standardizacija formata datuma
- **Mapiranje**: Automatsko mapiranje mjesta rođenja na nacionalnosti
- **Validacija**: Provjera konzistentnosti podataka

## 🚀 Pokretanje Aplikacije

### **Brzo Pokretanje**
```bash
# 1. Kloniraj ili preuzmi projekt
git clone [repository-url]

# 2. Otvori terminal u direktoriju projekta
cd VizualizacijaPodatakaProjekt

# 3. Pokreni lokalni web server
# Opcija A: Python 3
python -m http.server 8000

# Opcija B: Python 2  
python -m SimpleHTTPServer 8000

# Opcija C: Node.js
npx http-server

# Opcija D: PHP
php -S localhost:8000
```

### **Pristup Aplikaciji**
Otvori web pregljedač i idi na: `http://localhost:8000`

### **Sistemski Zahtjevi**
- **Web Preglednik**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript**: Mora biti omogućen
- **Internet Veza**: Potrebna za učitavanje D3.js i geografskih podataka
- **Rezolucija**: Minimalno 320px širine (mobile-first dizajn)

## 📱 Korisničko Sučelje

### **Navigacija**
- **Radio Buttoni**: Brzo prebacivanje između vizualizacija
- **Sidebar**: Kompaktni kontrolni panel s filterima
- **Responsive Layout**: Automatsko prilagođavanje na mobitelima

### **Interaktivni Elementi**
- **Tooltipovi**: Hover za detaljne informacije
- **Animacije**: Smooth tranzicije između stanja
- **Zoom**: Pan i zoom na karti
- **Filteri**: Real-time ažuriranje podataka

### **Vizualni Indikatori**
- **Svetci**: Zlatni ★ simbol
- **Animacija**: Progressbar s trenutnom godinom
- **Loading States**: Smooth tranzicije pri učitavanju
- **Error Handling**: Poruke za slučajeve bez podataka

## 🔧 Tehničke Implementacije

### **Optimizacija Performansi**
- **Debounced Resize**: Sprječavanje prekomjernog re-rendera
- **Frame Skipping**: Optimizacija animacije za bolje performanse
- **Efficient Data Binding**: Korištenje D3.js key funkcija
- **Memory Management**: Čišćenje event listenera

### **Responzivnost**
- **CSS Grid/Flexbox**: Fleksibilni layouti
- **Media Queries**: Breakpointi za različite uređaje
- **Viewport Meta**: Optimizacija za mobilne uređaje
- **Dynamic Sizing**: JavaScript-based dimenzioniranje

### **Pristupačnost**
- **Semantic HTML**: Pravilna struktura za screen readere
- **Color Contrast**: Dostupne boje za sve korisnike
- **Keyboard Navigation**: Podrška za navigaciju tipkovnicom
- **ARIA Labels**: Dodatne informacije za asistivne tehnologije

## 📊 Analitički Uvidi

### **Povijesni Trendovi**
- **Najduži Pontifikati**: Petar (35 godina), Pio IX (31.6 godina)
- **Najkraći Pontifikati**: Urban VII (13 dana), Bonifacije VI (15 dana)
- **Nacionalna Distribucija**: Dominacija talijanskih papa kroz povijest
- **Svetačka Analiza**: Veći postotak svetaca u ranijim stoljećima

### **Geografski Uvidi**
- **Europska Dominacija**: 95%+ papa iz Europe
- **Talijanska Hegemonija**: Preko 200 talijanskih papa
- **Diversifikacija**: Povećanje raznolikosti u 20./21. stoljeću

## 🎨 Dizajn Filozofija

### **Principi Dizajna**
- **Minimalizam**: Čisti, fokusiran interface
- **Hierarhija**: Jasna vizualna hierarhija informacija
- **Konzistentnost**: Ujednačeni stilovi kroz aplikaciju
- **Funkcionalnost**: Form slijedi funkciju

### **Paleta Boja**
- **Primarna**: #5cb85c (zelena) - glavna akcijska boja
- **Svetci**: #d4af37 (zlatna) - označava svetost
- **Neaktivno**: #666, #ccc (sive nijanse)
- **Pozadina**: #f4f4f4 (svijetlosiva)

## 🔬 Testiranje i Validacija

### **Cross-Browser Testing**
- **Chrome**: Glavni development browser
- **Firefox**: Alternativni engine testiranje
- **Safari**: iOS kompatibilnost
- **Edge**: Windows kompatibilnost

### **Responzivno Testiranje**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+
- **Large Screen**: 1440px+

### **Funkcionalnost**
- **Filteri**: Testiranje svih kombinacija
- **Animacije**: Smooth playback i kontrole
- **Data Integrity**: Validacija svih podataka
- **Error Handling**: Graceful failure scenarios

## 👥 Autor

**Karlo Kraml**  
Student, Kolegij Vizualizacija Podataka  
FERIT Osijek  

## 📜 Licenca

Ovaj projekt je razvijen u edukacijske svrhe kao dio kolegija Vizualizacija Podataka. Svi podaci o papama su javno dostupni povijesni podaci.

## 🔮 Buduće Mogućnosti

### **Nove Funkcionalnosti**
- **Export**: PDF/PNG izvoz grafikona
- **Search**: Pretraživanje specifičnih papa
- **Comparison**: Usporedba između papa
- **Bookmarking**: Spremanje omiljenih prikaza

### **Tehnološka Unapređenja**
- **WebGL**: Hardverski akcelerirana grafika
- **Progressive Web App**: Offline funkcionalnost
- **Real-time Updates**: Live ažuriranje podataka
- **Multi-language**: Podrška za više jezika

---

*Ovaj projekt demonstrira moderne tehnike vizualizacije podataka kroz bogatu i interaktivnu web aplikaciju koja čini kompleksne povijesne podatke pristupačnima i zanimljivima za istraživanje.*
