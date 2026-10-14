# Kasus Uji

Bagian A diisi **sebelum** mulai membangun. Hasil yang diharapkan dihitung sendiri oleh tim (boleh dengan kalkulator), bukan oleh AI.  
Bagian B diisi setelah aplikasi diuji.

| ID | Kriteria yang diuji | Langkah / input | Hasil yang diharapkan | Hasil sebenarnya | Lulus? | Bukti (nama file tangkapan layar) |
|---|---|---|---|---|---|---|
| U01 | Input yang salah (PPM negatif) | Masukkan Nama: "Kios A", Aset: 10000000, PPM: -50, Jam: 21:00, lalu klik Simpan | Form menolak dengan pesan error: "Nilai PPM tidak boleh negatif atau kosong" | Muncul pesan peringatan validasi merah dan data tidak tersimpan | Lulus | `bukti/u01-input-negatif.png` |
| U02 | Input yang salah (Nama kosong & aset 0) | Nama dikosongkan, Aset: 0, PPM: 200, Jam: 20:00, lalu klik Simpan | Form menolak dengan pesan error: "Nama kios wajib diisi dan nilai aset harus lebih dari Rp0" | Muncul pesan error pada input nama dan form batal submit | Lulus | `bukti/u02-input-kosong.png` |
| U03 | Kondisi Normal (Di bawah ambang) | Nama: "Kios Berkah", Aset: 15000000, PPM: 350, Jam: 22:00 (saat ini jam operasional aman) | Status gas: `NORMAL (Aman)`, Katup: `TERBUKA`, Rasio proteksi: 5.7% (850.000 / 15.000.000 * 100%) | Status NORMAL berwarna hijau, Katup Terbuka, Rasio 5.7% | Lulus | `bukti/u03-kondisi-normal.png` |
| U04 | Nilai tepat di batas ambang Waspada | Nama: "Warung Rames", Aset: 12500000, PPM: tepat 400, Jam: 21:00 | Status gas: `WASPADA (Rembesan Mikro)`, Katup: `TERBUKA`, Rasio proteksi: 6.8% (850.000 / 12.500.000 * 100%) | Status WASPADA berwarna kuning, Katup tetap terbuka, Rasio 6.8% | Lulus | `bukti/u04-batas-waspada.png` |
| U05 | Nilai tepat di batas ambang Darurat | Nama: "Ayam Goreng Mas Budi", Aset: 8500000, PPM: tepat 1000, Jam: 23:00 | Status gas: `DARURAT (Bahaya Kebocoran)`, Katup: `TERTUTUP (CUT-OFF)`, Rasio proteksi: 10.0% | Status DARURAT berwarna merah, Katup Otomatis Tertutup, Rasio 10.0% | Lulus | `bukti/u05-batas-darurat.png` |
| U06 | Ketahanan Data (Refresh Browser) | Simpan data kios, lalu muat ulang (*reload/refresh*) browser Chrome | Data yang tersimpan sebelumnya tetap tampil utuh di tabel rekapitulasi kios | Seluruh baris data tetap tampil sempurna dari LocalStorage | Lulus | `bukti/u06-persisten-refresh.png` |

---

## Unit Test Otomatis

* **Nama file test:** `tes/sigas.test.js`
* **Framework test:** Node.js Native Test Runner (`node --test`)
* **Jumlah test:** **6 test** lulus dari **6 test** (100% PASS)
* **Kasus yang dicakup unit test:**
  1. Validasi nilai input (nama kosong, aset nol, PPM negatif)
  2. Logika status PPM Normal (< 400)
  3. Logika status batas Waspada (== 400)
  4. Logika status batas Darurat (== 1000) dan penutupan katup
  5. Perhitungan formula matematis Rasio Proteksi Aset
  6. Filter pencarian dan penyaringan kategori kios
