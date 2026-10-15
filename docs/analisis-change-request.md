# Analisis Change Request

Isi bagian ini **sebelum** mengubah kode, lalu commit dan push (contoh pesan: `dokumen: analisis change request`). Juri memeriksa bahwa commit ini muncul sebelum commit perubahan kode.

**Change request:** pencarian, filter, dan ekspor CSV (lihat Tugas 3 di lembar challenge).

**Permintaan Perubahan:**
> "Data di website kalian akan terus bertambah dan pengguna mulai kesulitan menemukan data tertentu. Tambahkan pencarian dan filter di halaman daftar atau rekap, serta tombol untuk mengunduh data sebagai file CSV agar bisa diolah di Excel."

**Kriteria penerimaan yang akan dipenuhi dan cara kami memenuhinya:**
1. **Kotak Pencarian Instan (Case-Insensitive):**
   * *Cara memenuhi:* Menambahkan elemen `<input type="text" id="search-input">` pada toolbar di atas tabel rekapitulasi. Sistem menyaring data secara *real-time* saat pengguna mengetik (`input` event), mencocokkan kata kunci terhadap nama kios dan kategori tanpa membedakan huruf besar maupun kecil (`.toLowerCase()`).
2. **Filter Berdasarkan Status Bahaya Gas:**
   * *Cara memenuhi:* Menambahkan dropdown `<select id="filter-status">` dengan pilihan: `SEMUA`, `NORMAL`, `WASPADA`, `DARURAT`. Logika filter dan pencarian bekerja secara terintegrasi (kedua kondisi digabungkan dengan operator logika AND).
3. **Pesan "Data tidak ditemukan":**
   * *Cara memenuhi:* Jika hasil kombinasi pencarian dan filter menghasilkan daftar kosong (`filteredData.length === 0`), tabel akan menyembunyikan baris data dan menampilkan blok pesan *"Data tidak ditemukan"*.
4. **Tombol Unduh CSV untuk Data yang Sedang Tampil:**
   * *Cara memenuhi:* Menambahkan tombol `<button id="btn-export-csv">`. Ketika diklik, fungsi akan mengambil data hasil filter yang sedang aktif di layar, menyusun baris header nama kolom di baris pertama, kemudian menghasilkan file CSV via Blob URL dengan ekstensi `.csv`.
5. **Format Angka Excel-Ready Tanpa Simbol Mata Uang:**
   * *Cara memenuhi:* Nilai numerik seperti Nilai Aset modal usaha, pembacaan PPM, dan Rasio Proteksi diekspor dalam bentuk angka murni (contoh: `12500000`, bukan `Rp12.500.000` atau `12.500.000`), sehingga file langsung dapat diolah dan diformulasikan (SUM, AVERAGE) saat dibuka di Microsoft Excel.
6. **Regresi Nol (Kasus Uji Lama Tetap Lulus):**
   * *Cara memenuhi:* Seluruh alur inti registrasi kios, kalkulasi status PPM, pemutusan katup otomatis, dan penyimpanan persisten di LocalStorage (Kasus Uji U01 s/d U06) tetap berfungsi normal tanpa perubahan perilaku dasar.

---

## 1. Dampak

| Bagian yang terdampak | File / fungsi | Perubahan yang diperlukan |
|---|---|---|
| Spesifikasi | `docs/01-spesifikasi.md` | Menambahkan deskripsi fitur pencarian, filter status, dan ekspor CSV ke dalam daftar fitur website serta kriteria alur rekapitulasi data. |
| Kode | `src/index.html` | Menambahkan elemen kontainer `.toolbar` di atas tabel rekap kios yang berisi input `#search-input`, dropdown filter `#filter-status`, dan tombol unduh `#btn-export-csv`. Menambahkan kontainer `#empty-state` untuk pesan "Data tidak ditemukan". |
| Kode | `src/style.css` | Menambahkan styling visual untuk toolbar, input pencarian modern dengan ikon kaca pembesar, styling dropdown filter, tombol unduh CSV, dan desain kotak empty state yang selaras dengan tema SIGAS. |
| Kode | `src/app.js` | 1. Membuat fungsi murni `filterDataKios(kiosList, querySearch, filterStatus)` untuk memproses filtering array data.<br>2. Membuat fungsi `unduhDataCsv(dataList)` yang memformat header kolom, data baris numerik murni, dan memicu unduhan file CSV otomatis.<br>3. Menambahkan event listener `input` pada search box dan `change` pada filter dropdown untuk me-render ulang tabel secara instan. |
| Kasus uji / test | `docs/04-kasus-uji.md` & `tes/sigas.test.js` | 1. Menambahkan skenario kasus uji CR-01 hingga CR-04 pada dokumen kasus uji.<br>2. Menambahkan unit test otomatis pada `tes/sigas.test.js` untuk memverifikasi akurasi filter pencarian case-insensitive, filter status bahaya, dan format data ekspor CSV. |
| README | `README.md` | Memperbarui bagian ringkasan alur, panduan fitur pencarian & ekspor CSV, serta memperbarui tangkapan layar fitur baru di folder `docs/bukti/`. |

---

## 2. Kasus uji baru

| ID | Langkah / input | Hasil yang diharapkan |
|---|---|---|
| CR-01 | Ketik teks `"rames"` (huruf kecil) pada input `#search-input` saat terdapat data "Warung Rames Mbak Sri". | Tabel langsung menyaring dan hanya menampilkan baris kios "Warung Rames Mbak Sri" (pencarian bersifat *case-insensitive*). |
| CR-02 | Pilih dropdown `#filter-status` ke opsi `"DARURAT"`. | Tabel hanya menampilkan daftar kios yang berstatus DARURAT (kios dengan PPM $\ge 1.000$ atau katup tertutup otomatis). |
| CR-03 | Masukkan teks `"martabak"` pada search box sambil memilih filter status `"DARURAT"` (kondisi data tidak ada yang cocok). | Tabel menyembunyikan daftar baris dan menampilkan pesan informatif *"Data tidak ditemukan"*. |
| CR-04 | Lakukan pencarian/filter data tertentu, lalu klik tombol *"Unduh CSV"*. | File `.csv` otomatis terunduh; baris pertama berisi nama kolom (*ID_Kios, Nama_Kios, Kategori, Nilai_Aset, Jam_Tutup, Bacaan_PPM, Status_Bahaya, Kondisi_Katup, Rasio_Proteksi_Persen, Tanggal_Pemeriksaan*); data yang diunduh hanya data yang sedang tampil; kolom *Nilai_Aset* berupa angka murni (misal: `12500000` tanpa `Rp` atau titik), sehingga langsung dapat diformulasikan di Microsoft Excel. |

---

## 3. Setelah selesai
- [x] Kasus uji lama tetap lulus
- [x] Kasus uji baru lulus
- [x] Spesifikasi diperbarui
- [x] README diperbarui
