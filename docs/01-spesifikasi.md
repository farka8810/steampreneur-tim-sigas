# Spesifikasi Produk

**Nama tim: SIGAS
**Nama produk: SIGAS (Sistem Integrasi Gas Aman): Proteksi Kebocoran dan Kontrol Katup Otomatis LPG untuk UMKM Kuliner yang dapat dikontrol melalui web/apk
**Alur inti yang dibangun: mendaftarkan kios, mengatur batas jam tutup dan ambang konsentrasi gas, lalu memvalidasi simulasi pemutusan katup otomatis serta melihat estimasi rasio penyelamatan aset UMKM.

## 1. Masalah   
Kebocoran LPG merupakan risiko keselamatan fisik sekaligus ancaman kerugian ekonomi bagi usaha kuliner kecil. Berdasarkan hasil wawancara dan observasi lapangan di Purwokerto Selatan, kios kios sering ditinggal semalaman setelah operasional selesai dengan regulator tetep terpasang ke tabung gas. Ketika terjadi rembesan gas akibat seal karet getas atau selang retak, gas yang ngendap di ruang tertutup berpotensi meledak saat kios dibuka kembali. Ratarata kerugian aset kios kuliner yang terbakar mencapai Rp12,5 juta (mencakup kompor, gerobak, etalase, dan stok bahan).

## 2. Pengguna
1. Pengelola Sentra Kuliner / Pujasera / Kantin Sekolah
2. Pemilik Kios / Pedagang UMKM Kuliner

## 3. Hasil wawancara calon pengguna
Narasumber: Pemilik Warung Rames (Usaha Kuliner kecil, Jl. Pramuka Purwokerto)
Cara wawancara (langsung / lewat pesan) dan tanggal: tatap muka langsung di kios, 5 Oktober 2026

| Pertanyaan kami | Jawaban narasumber |
|---|---|
| Bagaimana kebiasaan bapak saat menutup warung di malam hari? | "Biasanya kompor cuma dimatikan dari knop kompor, regulator gas jarang dicopot dari tabung karena repot kalau besok subuh harus pasang lagi." |
| Pernahkah mengalami bau gas atau indikasi bocor? | "Pernah dua kali bau menyengat pas buka rolling door pagi-pagi, ternyata karet seal regulatornya kendor dan ada retak rambut di selang dekat kompor." |
| Berapa taksiran kerugian jika sampai terjadi kebakaran di kios? | "Etalase kaca, dua kulkas, gerobak, dan stok bumbu bisa habis Rp12 sampai 15 juta mas, belum kios sewaan orang lain yang nempel di samping." |
| Apa yang paling bapak harapkan dari sistem keamanan gas? | "Ada yang otomatis nutup katup gas pas warung tutup malam hari, dan kalau ada gas bocor langsung bunyi alarm dan nutup sendiri tanpa harus nunggu orang datang." |

## 4. Fitur wajib (hanya untuk alur inti)
1. Pemilihan dan Registrasi Kios: Memilih profil kios yang ada atau mendaftarkan kios baru lengkap dengan estimasi nilai aset modal usaha.
2. Formulir Konfigurasi Parameter Kios dengan Validasi: Input jam operasional tutup (format HH:MM) dan input simulasi/uji bacaan sensor gas (PPM). Validasi menolak input kosong, teks non-angka, angka negatif, atau angka di luar batas wajar (0 - 10.000 PPM).
3. Mesin Kalkulasi Aturan Bisnis & Logika Katup:
   * Menghitung status kebocoran (Normal, Waspada, Darurat).
   * Menentukan status katup gas (Terbuka vs Tertutup Otomatis).
   * Menghitung Rasio Perlindungan Aset Finansial terhadap HPP SIGAS.
4. Penyimpanan Lokal Persisten (LocalStorage): Seluruh data kios dan riwayat insiden tersimpan di browser dan tidak hilang saat halaman dimuat ulang ato refresh.
5. Panel Rekapitulasi Data Terintegrasi: Menampilkan daftar seluruh kios, status katup terkini, dan riwayat log pemeriksaan.

## 5. Di luar cakupan (tidak dikerjakan dalam challenge ini)
- Komunikasi nirkabel radio fisik ke modul mikrokontroler hardware ESP32 (fokus challenge pada sistem perangkat lunak web fungsional).
- Sistem pembayaran payment gateway langganan.
- Otentikasi multi-user dengan hak akses login yang kompleks.

## 6. Aturan bisnis dan perhitungan

1. **Status Tingkat Bahaya Gas:**
   - **Aman (Indikator Hijau):** Kadar gas di bawah 400 PPM (kondisi normal operasional).
   - **Waspada (Indikator Kuning):** Kadar gas 400 – 999 PPM (ada bau atau rembesan kecil, sistem memberi peringatan).
   - **Bahaya (Indikator Merah):** Kadar gas 1.000 PPM ke atas (kebocoran gas pekat, alarm berbunyi dan katup langsung dimatikan).

2. **Aturan Katup Gas Otomatis:**
   - Katup otomatis **menutup (aliran gas diputus)** jika:
     * Kadar gas masuk status **Bahaya** (1.000 PPM ke atas), ATAU
     * Kios sudah masuk **jam tutup / di luar jam operasional**.
   - Katup hanya **terbuka (gas mengalir)** jika kondisi gas aman dan kios sedang dalam jam buka operasional.

3. **Perhitungan Rasio Proteksi Aset:**
   - Menghitung persentase biaya pasang alat dibanding total aset kios yang dilindungi dari risiko kebakaran.
   - **Rumus:**  
     `Rasio Proteksi = (Biaya Alat SIGAS / Nilai Aset Kios) x 100%`
   - Biaya alat SIGAS diestimasi sebesar Rp850.000 per unit.
   - **Contoh Perhitungan:**  
     Jika aset kios ditaksir Rp12.500.000, maka:  
     `(850.000 / 12.500.000) x 100% = 6,8%`  
     (Artinya, pedagang hanya mengeluarkan biaya sekitar 6,8% dari total modal asetnya untuk mendapatkan proteksi otomatis).

## 7. Data yang disimpan
| Data | Contoh Isi | Disimpan di Mana |
|---|---|---|
| ID & Nama Kios | `kios-01`, `Warung Rames Mbak Sri` | `localStorage: sigas_kios_list` |
| Nilai Aset Kios | `12500000` (Rp12.500.000) | `localStorage: sigas_kios_list` |
| Jam Tutup Operasional | `21:00` | `localStorage: sigas_kios_list` |
| Konsentrasi Gas Uji (PPM) | `1250` | `localStorage: sigas_kios_list` |
| Status Katup & Bahaya | `DARURAT`, `TERTUTUP` | `localStorage: sigas_kios_list` |
| Waktu Pemeriksaan | `13/10/2026, 15:30 WIB` | `localStorage: sigas_kios_list` |

## 8. Kriteria "selesai"
- [ ] Form menolak input nama kios yang kosong dengan pesan kesalahan yang jelas.
- [ ] Form menolak input nilai aset non-angka atau bernilai <= 0.
- [ ] Form menolak input PPM gas yang negatif, bernilai > 10.000, atau kosong.
- [ ] Sistem secara tepat menetapkan status `NORMAL` jika PPM = 350.
- [ ] Sistem secara tepat menetapkan status `WASPADA` pada batas ambang tepat PPM = 400.
- [ ] Sistem secara tepat menetapkan status `DARURAT` dan menutup katup pada batas ambang tepat PPM = 1.000.
- [ ] Sistem secara tepat menghitung rasio proteksi aset sebesar 6,8% untuk aset bernilai Rp12.500.000.
- [ ] Data kios baru berhasil tersimpan dan langsung muncul di tabel daftar rekap.
- [ ] Data tetap ada dan tidak terhapus ketika browser di-refresh.