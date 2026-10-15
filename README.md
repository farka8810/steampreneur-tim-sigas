# SIGAS (Sistem Integrasi Gas Aman) — Web Sentinel Dashboard

Website pemantauan sentra kuliner dan manajemen katup otomatis tabung LPG berbasis IoT untuk melindungi aset pelaku UMKM mikro dari risiko ledakan kebocoran gas.

---

## Alur Inti

Alur utama perjalanan pengguna (*core user journey*) dari awal sampai akhir terdiri dari 3 langkah:

1. **Langkah 1: Memilih / Mendaftarkan Kios Kuliner**  
   Pengguna memasukkan nama kios kuliner (misal: *Warung Rames Mbak Sri*) dan estimasi nilai aset tempat usaha yang dilindungi.
2. **Langkah 2: Mengatur Jam Operasional & Parameter Uji Sensor**  
   Pengguna menentukan jam tutup kios dan memasukkan nilai uji konsentrasi sensor gas LPG dalam satuan PPM (*Parts Per Million*). Formulir dilengkapi validasi ketat menolak input kosong, teks alfabet pada kolom angka, atau angka negatif.
3. **Langkah 3: Kalkulasi Status Bahaya, Eksekusi Katup, dan Evaluasi Finansial**  
   Sistem mengevaluasi status bahaya secara *real-time* (Normal, Waspada, atau Darurat), mengeksekusi penutupan katup gas otomatis jika terdeteksi bahaya atau melewati jam tutup, menghitung rasio penghematan/proteksi aset, serta menyimpan data secara persisten ke *LocalStorage*.

---

## Cara Menjalankan (How to Run)

### Prasyarat
- Browser web modern (Google Chrome, Microsoft Edge, atau Mozilla Firefox)
- Node.js versi 18 atau lebih baru (opsional, hanya diperlukan untuk menjalankan unit test otomatis)

### Langkah Menjalankan Website
1. **Clone repositori:**
   ```bash
   git clone https://github.com/hanifrizki/steampreneur-sigas.git
   ```
2. **Masuk ke folder proyek:**
   ```bash
   cd steampreneur-sigas
   ```
3. **Buka website di browser:**
   * Cukup klik dua kali berkas `src/index.html`, **ATAU**
   * Buka browser dan buka file: `file:///path/to/steampreneur-sigas/src/index.html`, **ATAU**
   * Gunakan ekstensi *Live Server* di VS Code atau jalankan via npx:
     ```bash
     npx serve src -p 3000
     ```
     Lalu buka `http://localhost:3000` di browser.

### Data Contoh Pengujian

| Nama Kios | Estimasi Nilai Aset | Jam Tutup | Nilai PPM Uji | Hasil yang Diharapkan |
|---|---|---|---|---|
| Warung Rames Mbak Sri | Rp12.500.000 | 21:00 | 250 PPM | Status Normal, Katup Terbuka, Rasio Proteksi 6,8% |
| Ayam Goreng Mas Budi | Rp8.500.000 | 22:00 | 550 PPM | Status Waspada (Kuning), Katup Terbuka, Rasio 10,0% |
| Kios Mie & Bakso Barokah | Rp18.000.000 | 20:00 | 1.450 PPM | Status DARURAT (Merah), Katup CUT-OFF Tertutup, Rasio 4,7% |

### Jika Terjadi Masalah
- **Data tidak muncul setelah refresh:** Pastikan fitur *LocalStorage* di peramban tidak dinonaktifkan atau tidak sedang menggunakan mode *Incognito/Private Window* yang memblokir penyimpanan lokal.

---

## Cara Menjalankan Pengujian

Proyek ini dilengkapi dengan unit test otomatis berbasis *Node.js Native Test Runner*:

```bash
node --test tes/sigas.test.js
```

**Hasil yang diharapkan:**
```text
✔ Validasi: Menolak nama kosong, aset <= 0, dan PPM negatif
✔ Logika Status: Menghasilkan status NORMAL jika PPM < 400
✔ Batas Ambang: Menghasilkan status WASPADA jika PPM tepat 400
✔ Batas Ambang: Menghasilkan status DARURAT dan menutup katup jika PPM >= 1000
✔ Numerasi: Menghitung Rasio Proteksi Aset secara presisi
✔ Fitur Pencarian & Filter: Berfungsi menyaring data tabel rekap

ℹ tests 6
ℹ pass 6
ℹ fail 0
```

---

## Fitur
- [x] Pendaftaran kios UMKM dengan estimasi nilai aset usaha.
- [x] Validasi input komprehensif (pencegahan input kosong, negatif, dan nilai ekstrem).
- [x] Mesin logika deteksi kebocoran gas LPG (Normal, Waspada, Darurat).
- [x] Simulasi otomatisasi katup pengunci (*valve cut-off*) lokal.
- [x] Perhitungan kontekstual *Rasio Proteksi Aset* terhadap biaya investasi SIGAS.
- [x] Penyimpanan lokal persisten (*LocalStorage*).
- [x] Kotak pencarian data kios *real-time* (tanpa membedakan huruf besar/kecil).
- [x] Filter status operasional (Semua, Normal, Waspada, Darurat).
- [x] Ekspor data laporan ke format berkas CSV standar (angka murni tanpa simbol Rp untuk diolah di Excel).

## Batasan yang Diketahui
- Belum terhubung ke server database cloud multi-pengguna karena sistem dirancang *standalone* offline-first untuk keandalan lokal di sentra kuliner.

---

## Struktur Folder

| File / Folder | Isi & Fungsi |
|---|---|
| `docs/` | Dokumen kerja, spesifikasi, rencana kerja, log prompt, kasus uji, catatan bug, dan penjelasan kode |
| `src/` | Kode sumber website utama (`index.html`, `style.css`, `app.js`) |
| `tes/` | Berkas pengujian unit otomatis (`sigas.test.js`) |
| `bukti/` | Tangkapan layar bukti pengujian dan dokumen evaluasi |
| `bughunt-kasir/` | Berkas tugas Bug Hunt Kasir Kantin STEAM |

---

## Sumber dan Lisensi

| Nama | Sumber | Lisensi |
|---|---|---|
| Inter Font | Google Fonts | SIL Open Font License 1.1 |
| Lucide Icons | Lucide CDN | MIT License |
| Normalize CSS Reset | Standar Modern CSS | MIT License |

---

## Tim Pengembang (SMK Telkom Purwokerto)

| Nama Anggota | Peran dalam Tim |
|---|---|
| **Hanif Rizki Ardianto** | Ketua Tim & Arsitek Logika Sistem (Aturan Bisnis & Validasi Form) |
| **Fabian Arkananta Firmansyah** | Anggota Tim (Desain UI/UX Dashboard, Filter, & Ekspor CSV) |
