# Spesifikasi Produk

**Nama tim:** SIGAS  
**Nama produk:** SIGAS (Sistem Integrasi Gas Aman) — Web Sentinel Dashboard  
**Alur inti yang dibangun:** Pengelola sentra kuliner mendaftarkan kios, mengatur batas jam tutup dan ambang konsentrasi gas, lalu memvalidasi simulasi pemutusan katup otomatis serta melihat estimasi rasio penyelamatan aset UMKM.

---

## 1. Masalah
Kebocoran LPG merupakan risiko keselamatan fisik sekaligus ancaman kerugian ekonomi bagi usaha kuliner mikro. Berdasarkan observasi lapangan di Purwokerto Selatan, kios-kios sering ditinggalkan semalaman setelah operasional selesai dengan regulator tetap terpasang pada tabung gas 3 kg. Ketika terjadi rembesan gas akibat seal karet getas atau selang retak, gas yang mengendap di ruang tertutup berpotensi meledak saat kios dibuka kembali. Rata-rata kerugian aset kios kuliner yang terbakar mencapai Rp12,5 juta (mencakup kompor, gerobak, etalase, dan stok bahan).

## 2. Pengguna
1. **Pengelola Sentra Kuliner / Pujasera / Kantin Sekolah:** Membutuhkan satu dashboard terpusat untuk memantau keselamatan seluruh kios tenant binaannya.
2. **Pemilik Kios / Pedagang UMKM Kuliner:** Membutuhkan kepastian bahwa aliran gas kompornya otomatis terkunci rapat saat kios ditinggalkan tutup dan otomatis memutus aliran jika terjadi kebocoran gas.

## 3. Hasil Wawancara Calon Pengguna

* **Narasumber 1:** Pemilik Warung Rames (Usaha Kuliner Mikro, Jl. Pramuka Purwokerto)  
* **Cara Wawancara & Tanggal:** Tatap muka langsung di kios, 5 Oktober 2026.

| Pertanyaan kami | Jawaban narasumber |
|---|---|
| Bagaimana kebiasaan bapak saat menutup warung di malam hari? | "Biasanya kompor cuma dimatikan dari knop kompor, regulator gas jarang dicopot dari tabung karena repot kalau besok subuh harus pasang lagi." |
| Pernahkah mengalami bau gas atau indikasi bocor? | "Pernah dua kali bau menyengat pas buka rolling door pagi-pagi, ternyata karet seal regulatornya kendor dan ada retak rambut di selang dekat kompor." |
| Berapa taksiran kerugian jika sampai terjadi kebakaran di kios? | "Etalase kaca, dua kulkas, gerobak, dan stok bumbu bisa habis Rp12 sampai 15 juta mas, belum kios sewaan orang lain yang nempel di samping." |
| Apa yang paling bapak harapkan dari sistem keamanan gas? | "Ada yang otomatis nutup katup gas pas warung tutup malam hari, dan kalau ada gas bocor langsung bunyi alarm dan nutup sendiri tanpa harus nunggu orang datang." |

---

## 4. Fitur Wajib (Hanya untuk Alur Inti)
1. **Pemilihan dan Registrasi Kios:** Memilih profil kios yang ada atau mendaftarkan kios baru lengkap dengan estimasi nilai aset modal usaha.
2. **Formulir Konfigurasi Parameter Kios dengan Validasi:** Input jam operasional tutup (format HH:MM) dan input simulasi/uji bacaan sensor gas (PPM). Validasi menolak input kosong, teks non-angka, angka negatif, atau angka di luar batas wajar (0 - 10.000 PPM).
3. **Mesin Kalkulasi Aturan Bisnis & Logika Katup:**
   * Menghitung status kebocoran (Normal, Waspada, Darurat).
   * Menentukan status katup gas (Terbuka vs Tertutup Otomatis).
   * Menghitung Rasio Perlindungan Aset Finansial terhadap HPP SIGAS.
4. **Penyimpanan Lokal Persisten (*LocalStorage*):** Seluruh data kios dan riwayat insiden tersimpan di browser dan tidak hilang saat halaman dimuat ulang (*refresh*).
5. **Panel Rekapitulasi Data Terintegrasi:** Menampilkan daftar seluruh kios, status katup terkini, dan riwayat log pemeriksaan.
6. **Fitur Manajemen Data Lanjutan (Change Request):**
   * Kotak pencarian data kios *real-time* bersifat *case-insensitive*.
   * Dropdown filter status kebocoran gas (*Semua, Normal, Waspada, Darurat*) yang dapat dikombinasikan secara simultan dengan pencarian.
   * Ekspor data rekapitulasi ke berkas CSV dengan format angka murni (tanpa format mata uang/titik ribuan) untuk pengolahan di Microsoft Excel.

---

## 5. Di Luar Cakupan (Tidak Dikerjakan dalam Challenge Ini)
- Komunikasi nirkabel radio fisik ke modul mikrokontroler hardware ESP32 (fokus challenge pada sistem perangkat lunak web fungsional).
- Sistem pembayaran *payment gateway* langganan.
- Otentikasi multi-user dengan hak akses login yang kompleks.

---

## 6. Aturan Bisnis dan Perhitungan

1. **Aturan Status Bahaya Gas (Tri-State PPM Logic):**
   * Jika $\text{PPM} < 400$: Status **NORMAL (Aman)**, Indikator Hijau.
   * Jika $400 \le \text{PPM} < 1.000$: Status **WASPADA (Rembesan Mikro)**, Indikator Kuning.
   * Jika $\text{PPM} \ge 1.000$: Status **DARURAT (Bahaya Kebocoran)**, Indikator Merah.
2. **Aturan Penutupan Katup Otomatis (Valve Cut-Off Logic):**
   * Katup berstatus **TERTUTUP (CUT-OFF)** jika:
     * Status gas mencapai **DARURAT** ($\text{PPM} \ge 1.000$), **ATAU**
     * Kios berada dalam status **TUTUP / Di Luar Jam Operasional**.
   * Selain kondisi darurat atau jam tutup di atas, katup berstatus **TERBUKA (GAS MENGALIR)**.
3. **Perhitungan Rasio Perlindungan Aset (*Asset Protection Ratio*):**
   * Biaya Investasi SIGAS per unit ditetapkan: $\text{Rp}850.000$.
   * Formula:
     $$\text{Rasio Proteksi} = \left( \frac{\text{Rp}850.000}{\text{Nilai Aset Kios}} \right) \times 100\%$$
   * Hasil dibulatkan ke satu angka di belakang koma (misal: $6,8\%$).

---

## 7. Data yang Disimpan

| Data | Contoh Isi | Disimpan di Mana |
|---|---|---|
| ID & Nama Kios | `kios-01`, `Warung Rames Mbak Sri` | `localStorage: sigas_kios_list` |
| Nilai Aset Kios | `12500000` (Rp12.500.000) | `localStorage: sigas_kios_list` |
| Jam Tutup Operasional | `21:00` | `localStorage: sigas_kios_list` |
| Konsentrasi Gas Uji (PPM) | `1250` | `localStorage: sigas_kios_list` |
| Status Katup & Bahaya | `DARURAT`, `TERTUTUP` | `localStorage: sigas_kios_list` |
| Waktu Pemeriksaan | `13/10/2026, 15:30 WIB` | `localStorage: sigas_kios_list` |

---

## 8. Kriteria "Selesai"

- [ ] Form menolak input nama kios yang kosong dengan pesan kesalahan yang jelas.
- [ ] Form menolak input nilai aset non-angka atau bernilai $\le 0$.
- [ ] Form menolak input PPM gas yang negatif, bernilai $> 10.000$, atau kosong.
- [ ] Sistem secara tepat menetapkan status `NORMAL` jika $\text{PPM} = 350$.
- [ ] Sistem secara tepat menetapkan status `WASPADA` pada batas ambang tepat $\text{PPM} = 400$.
- [ ] Sistem secara tepat menetapkan status `DARURAT` dan menutup katup pada batas ambang tepat $\text{PPM} = 1.000$.
- [ ] Sistem secara tepat menghitung rasio proteksi aset sebesar $6,8\%$ untuk aset bernilai Rp12.500.000.
- [ ] Data kios baru berhasil tersimpan dan langsung muncul di tabel daftar rekap.
- [ ] Data tetap ada dan tidak terhapus ketika browser di-refresh.
