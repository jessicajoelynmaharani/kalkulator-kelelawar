# 🦇 Bat Adventure — Night Calculator

Kalkulator modern, futuristik, responsif, dan interaktif dengan tema **kelelawar malam**. Proyek ini dibuat hanya dengan HTML5, CSS3, dan Vanilla JavaScript sehingga dapat langsung digunakan di GitHub Pages tanpa backend.

## Fitur

- 🦇 Tema Bat Adventure / Night Calculator
- 🌙 Dark Night dan Moon Light mode
- ➕ Operasi dasar: tambah, kurang, kali, bagi, persen, negatif, desimal
- 🔬 Scientific: √, x², xʸ, 1/x, ±, sin, cos, tan, asin, acos, atan, log, ln, eˣ, 10ˣ, π, e, φ, factorial, modulus (mod), random number, absolute value
- 💻 Programmer: BIN, OCT, DEC, HEX, AND, OR, XOR, NOT, SHL, SHR
- 🔄 Converter: panjang, berat, suhu, luas, volume, waktu, kecepatan, data digital, energi
- 📜 History tersimpan di LocalStorage
- 🧠 Memory: MC, MR, M+, M-, MS
- ⭐ XP dan level
- 🏆 Achievement
- 🔊 Sound effect menggunakan Web Audio API
- ⌨️ Keyboard support
- 📱 Responsive untuk desktop, tablet, dan smartphone
- ♿ Focus, label, dan keyboard navigation dasar
- 🚫 Tidak memakai backend atau framework berat

## Struktur

```text
bat-adventure-calculator/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Menjalankan

Tidak membutuhkan instalasi.

1. Download atau salin ke satu folder.
2. Buka `index.html` di browser.
3. Semua data history, memory, XP, achievement, dan pengaturan disimpan pada browser.

## GitHub Pages

1. Buat repository baru di GitHub.
2. Upload `index.html`, `style.css`, `script.js`, dan `README.md`.
3. Buka **Settings → Pages**.
4. Pada Source pilih branch `main`.
5. Pilih folder `/root`.
6. Klik **Save**.
7. Tunggu GitHub Pages menerbitkan website.

## Keyboard Shortcuts

| Tombol | Fungsi |
|---|---|
| `0-9` | Angka |
| `+` | Tambah |
| `-` | Kurang |
| `*` | Kali |
| `/` | Bagi |
| `Enter` | Sama dengan |
| `Escape` | Clear |
| `Backspace` | Hapus |
| `%` | Persen |
| `.` | Desimal |

## Kustomisasi Tema

### Nama dan logo

Edit bagian brand di `index.html`:

```html
<h1>BAT ADVENTURE</h1>
<p>NIGHT CALCULATOR</p>
```

Emoji `🦇` juga dapat diganti dengan SVG atau logo sendiri.

### Warna

Edit CSS variables pada bagian awal `style.css`:

```css
:root {
  --pink: #ff69c8;
  --purple: #9b6cff;
  --cyan: #66d9ff;
  --bg: #080713;
}
```

### Pesan kelelawar

Edit fungsi `message()` atau teks seperti:

```javascript
message("Calculation complete! +10 XP 🦇");
```

### Nama level

Edit array:

```javascript
const levels = [
  "Night Rookie",
  "Bat Apprentice",
  "Moon Flyer",
  "Shadow Bat",
  "Crystal Bat",
  "Night Guardian",
  "Royal Bat",
  "Legendary Bat",
  "Master of Numbers",
  "Bat Master"
];
```

## LocalStorage

Data disimpan dengan key:

```text
batAdventureCalculator
```

Data mencakup history, memory, XP, level, achievement, dan settings.

## Catatan

Aplikasi tidak menggunakan `eval()`. Operasi dasar diproses oleh mesin kalkulator JavaScript sederhana, sementara fungsi tambahan diproses melalui fungsi matematika bawaan JavaScript.

## Lisensi

Bebas digunakan dan dimodifikasi untuk proyek pribadi maupun pembelajaran.


## Logo tambahan
Folder `assets/` berisi dua logo yang ditampilkan di header aplikasi: logo **SMKN 1 Sanden** dan logo **RPL**. Keduanya sudah dibuat transparan agar menyatu dengan tema malam.
