# Kasus Uji

Bagian A diisi **sebelum** mulai membangun. Hasil yang diharapkan dihitung sendiri oleh tim (boleh dengan kalkulator), bukan oleh AI.  
Bagian B diisi setelah aplikasi diuji.

| ID | Kriteria yang diuji | Langkah / input | Hasil yang diharapkan | Hasil sebenarnya | Lulus? | Bukti (nama file tangkapan layar) |
|---|---|---|---|---|---|---|
| U01 | Input yang salah (PPM negatif) | Masukkan Nama: "Kios A", Aset: 10000000, PPM: -50, Jam: 21:00, lalu klik Simpan | Form menolak dengan pesan error: "Nilai PPM tidak boleh negatif atau kosong" | | | |
| U02 | Input yang salah (Nama kosong & aset 0) | Nama dikosongkan, Aset: 0, PPM: 200, Jam: 20:00, lalu klik Simpan | Form menolak dengan pesan error: "Nama kios wajib diisi dan nilai aset harus lebih dari Rp0" | | | |
| U03 | Kondisi Normal (Di bawah ambang) | Nama: "Kios Berkah", Aset: 15000000, PPM: 350, Jam: 22:00 (saat ini jam operasional aman) | Status gas: `NORMAL (Aman)`, Katup: `TERBUKA`, Rasio proteksi: 5.7% (850.000 / 15.000.000 * 100%) | | | |
| U04 | Nilai tepat di batas ambang Waspada | Nama: "Warung Rames", Aset: 12500000, PPM: tepat 400, Jam: 21:00 | Status gas: `WASPADA (Rembesan kecil)`, Katup: `TERBUKA`, Rasio proteksi: 6.8% (850.000 / 12.500.000 * 100%) | | | |
| U05 | Nilai tepat di batas ambang Darurat | Nama: "Ayam Goreng Mas Budi", Aset: 8500000, PPM: tepat 1000, Jam: 23:00 | Status gas: `DARURAT (Bahaya Kebocoran)`, Katup: `TERTUTUP`, Rasio proteksi: 10.0% (850.000 / 8.500.000 x 100%) | | | |
| U06 | Ketahanan Data (Refresh Browser) | Simpan data kios, lalu muat ulang (refresh) browser | Data yang tersimpan sebelumnya tetap tampil utuh di tabel rekapitulasi kios | | | |

## Unit test otomatis (jika ada)
Nama file test: ...
Jumlah test: ... lulus dari ...
