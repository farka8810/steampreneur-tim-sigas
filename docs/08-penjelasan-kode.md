# Penjelasan Kode

Tidak ada sesi presentasi, jadi dokumen ini adalah bukti utama bahwa tim memahami kode yang dihasilkan AI.

Aturan:
- Setiap anggota menjelaskan **minimal dua bagian kode yang berbeda**. Bagian yang dijelaskan tidak boleh sama dengan anggota lain.
- Tulis dengan bahasa sendiri. Boleh bertanya ke AI untuk memahami, tetapi jangan menyalin jawabannya.
- Sebut nama file dan fungsi yang nyata, serta contoh nilai yang nyata.
- Jika memungkinkan, setiap anggota meng-commit bagiannya sendiri dari akun GitHub masing-masing.

---

## Bagian A: Penjelasan per anggota

### Penjelasan 1
- **Ditulis oleh:** Hanif Rizki Ardianto (Ketua Tim)
- **File dan fungsi:** `src/app.js` — Fungsi `evaluasiStatusGas(ppm, isClosed)`
- **Apa yang dilakukan:** Mengevaluasi angka konsentrasi gas dalam satuan PPM dan status jam operasional buka/tutup kios untuk menentukan tingkat bahaya keamanan (`NORMAL`, `WASPADA`, `DARURAT`) serta memutuskan apakah katup regulator gas harus dibuka atau diputus secara otomatis (*valve cut-off*).
- **Kenapa dibuat seperti ini:** Karena dalam sistem keamanan gas LPG fisik, kita tidak boleh hanya bergantung pada satu ambang batas biner (ada gas/tidak ada gas). Perlu ada zona *Waspada* (400–999 PPM) untuk mendeteksi rembesan mikro selang tanpa mematikan kompor pedagang yang sedang memasak. Namun jika mencapai 1.000 PPM (ambang bahaya pekat) atau kios sudah tutup ditinggal semalaman (`isClosed = true`), katup harus diputus seketika demi mencegah ledakan.
- **Contoh:** jika inputnya `ppm = 350, isClosed = false`, hasilnya `{ statusBahaya: "NORMAL", statusKatup: "TERBUKA" }` karena kadar gas di bawah 400 PPM dan kios sedang buka. Jika inputnya `ppm = 1250`, hasilnya `{ statusBahaya: "DARURAT", statusKatup: "TERTUTUP" }`.
- **Jika input salah atau kosong:** Jika `ppm` kosong atau `null`, fungsi mengonversi dengan `Number(ppm)` menjadi 0 sehingga berstatus default `NORMAL`, atau ditolak pada lapisan validasi form.

### Penjelasan 2
- **Ditulis oleh:** Hanif Rizki Ardianto (Ketua Tim)
- **File dan fungsi:** `src/app.js` — Fungsi `validasiInputKios(nama, aset, jamTutup, ppm)` & Logika Submit Form
- **Apa yang dilakukan:** Melakukan pemeriksaan validasi komprehensif terhadap seluruh field formulir sebelum data diproses dan disimpan ke sistem LocalStorage.
- **Kenapa dibuat seperti ini:** Menerapkan prinsip *defensive programming*. Form tidak boleh hanya mengandalkan atribut HTML5 karena mudah dibypass. JavaScript memastikan nama tidak boleh kosong atau spasi saja, nilai aset modal harus angka positif $> 0$, PPM gas berada di rentang fisik sensor yang wajar ($0 \le \text{PPM} \le 10.000$), dan format jam tutup harus format 24 jam yang valid (`HH:MM`) via Regular Expression.
- **Contoh:** jika inputnya `nama = "Kios A", aset = 0, jam = "21:00", ppm = -50`, hasilnya `{ isValid: false, errors: { aset: "Nilai aset harus lebih dari Rp0", ppm: "Nilai PPM tidak boleh negatif" } }`. Form menolak submit dan menampilkan pesan kesalahan merah.
- **Jika input salah atau kosong:** Fungsi mengumpulkan seluruh pesan kesalahan ke dalam objek kamus `errors` agar pengguna dapat mengetahui semua kesalahan form dalam satu kali klik submit tanpa kehilangan input lainnya.

### Penjelasan 3
- **Ditulis oleh:** Fabian Arkananta Firmansyah (Anggota Tim)
- **File dan fungsi:** `src/app.js` — Fungsi `filterDataKios(kiosList, querySearch, filterStatus)`
- **Apa yang dilakukan:** Menyaring daftar array data kios berdasarkan kata kunci pencarian teks yang diketik pengguna dan status bahaya yang dipilih dari dropdown filter secara *real-time*.
- **Kenapa dibuat seperti ini:** Menggunakan method `.filter()` murni yang tidak merusak data asli. Pencarian dibuat *case-insensitive* dengan menerapkan `.toLowerCase()` pada kata kunci maupun nama kios. Fitur ini dirancang terpadu sehingga pengguna dapat mencari nama kios tertentu sekaligus memfilter hanya yang berstatus DARURAT.
- **Contoh:** jika inputnya 3 data kios, `querySearch = "rames"`, `filterStatus = "SEMUA"`, hasilnya mengembalikan 1 baris kios "Warung Rames Mbak Sri". Jika dicari `martabak` dengan filter `DARURAT`, hasilnya mengembalikan array kosong `[]` (memicu tampilan "Data tidak ditemukan").
- **Jika input salah atau kosong:** Jika teks pencarian kosong, kondisi `!q` bernilai `true` sehingga seluruh data ditampilkan selama statusnya cocok. Jika tidak ada kecocokan, fungsi menghasilkan array kosong yang memunculkan blok pesan informatif *"Data tidak ditemukan"*.

### Penjelasan 4
- **Ditulis oleh:** Fabian Arkananta Firmansyah (Anggota Tim)
- **File dan fungsi:** `src/app.js` — Fungsi `unduhDataCsv(dataList)`
- **Apa yang dilakukan:** Mengonversi data kios yang sedang aktif tampil di tabel menjadi format teks berkas CSV (*Comma-Separated Values*) dan memicu pengunduhan otomatis ke komputer pengguna tanpa memerlukan server backend.
- **Kenapa dibuat seperti ini:** Sesuai permintaan Change Request (Tugas 3), format data numerik (seperti Nilai Aset dan PPM) sengaja diekspor sebagai angka murni tanpa simbol `Rp` atau titik pemisah (contoh: `12500000`), sehingga berkas langsung bisa diformulasikan (`=SUM()`, `=AVERAGE()`) saat dibuka di Microsoft Excel. Setiap teks dibungkus tanda kutip ganda agar nama kios yang memuat karakter koma tidak memecah baris kolom CSV.
- **Contoh:** Pengguna memfilter kios DARURAT lalu klik "Unduh CSV" $\rightarrow$ peramban langsung mengunduh berkas `rekap_sigas_<timestamp>.csv` yang baris pertamanya berisi nama header kolom resmi dan hanya memuat baris data yang sedang tampil.
- **Jika input salah atau kosong:** Jika tombol unduh diklik saat tabel kosong, sistem menampilkan alert dialog `"Tidak ada data yang dapat diunduh."` dan membatalkan pembuatan objek `Blob`.

---

## Bagian B: Pertanyaan yang dijawab bersama

1. **Jika aturan bisnis utama di spesifikasi berubah (tuliskan contoh perubahannya), file dan fungsi mana yang harus diubah? Jelaskan alasannya.**
   * *Contoh Perubahan:* Batas ambang Darurat kebocoran gas LPG diturunkan dari 1.000 PPM menjadi 800 PPM, dan batas Waspada menjadi 300 PPM.
   * *File dan Fungsi yang Diubah:* `src/app.js` pada fungsi `evaluasiStatusGas()` (mengubah ambang numerik percabangan `ppm < 300` dan `ppm >= 800`), `src/index.html` (mengubah teks label grafik gauge), dan `tes/sigas.test.js` (mengubah nilai pengujian test).
   * *Alasan:* Karena seluruh logika status gas dipusatkan di satu fungsi mandiri (*single source of truth*), perubahan tidak merusak tabel maupun penyimpanan LocalStorage.

2. **Bagaimana data mengalir dari saat pengguna mengisi form sampai hasilnya tampil di layar? Sebutkan file dan fungsi yang dilewati secara berurutan.**
   * *Alur Aliran Data:*
     1. Pengguna mengetik form di `src/index.html`.
     2. Event listener `submit` di `src/app.js` menangkap input.
     3. Dikirim ke `validasiInputKios()` untuk verifikasi integritas data.
     4. Dikirim ke `evaluasiStatusGas()` untuk menghitung status bahaya dan katup.
     5. Dikirim ke `hitungRasioProteksi()` untuk kalkulasi persentase numerasi proteksi aset.
     6. Digabung jadi objek kios dan disimpan via `saveRecords()` ke LocalStorage.
     7. Ditampilkan ke layar melalui fungsi `renderTable()` dan ringkasan metrik di `renderStats()`.

3. **Pilih satu unit test. Apa yang diuji, dan dalam kondisi apa test itu akan gagal?**
   * *Unit Test:* Test nomor 4 pada `tes/sigas.test.js` (`Batas Ambang: Menghasilkan status DARURAT dan memutus katup jika PPM >= 1000`).
   * *Yang Diuji:* Memastikan sistem tepat memicu status `DARURAT` dan menutup katup saat konsentrasi gas mencapai tepat angka batas 1.000 PPM.
   * *Kondisi Gagal:* Jika programmer salah menggunakan operator `ppm > 1000` (lebih besar murni), maka nilai tepat 1.000 PPM masih akan berstatus `WASPADA` dan katup tetap `TERBUKA`, sehingga asersi test akan memicu error gagal.

4. **Pilih satu saran AI yang kalian tolak. Apa sarannya dan kenapa kalian menolaknya?**
   * *Saran yang Ditolak:* AI menyarankan menggunakan framework React/Vite dengan puluhan library external seperti TailwindCSS dan Webpack bundler.
   * *Alasan Ditolak:* Penggunaan HTML, CSS, dan JavaScript vanilla jauh lebih ringan, cepat dibuka juri tanpa proses kompilasi `npm run build`, bebas folder `node_modules` yang berat, dan membuat seluruh anggota tim memahami kode secara transparan.

5. **Bagian kode mana yang paling sulit dipahami, dan bagaimana kalian akhirnya memahaminya?**
   * *Bagian Tersulit:* Mekanisme pembuatan file CSV secara lokal menggunakan `Blob` dan `URL.createObjectURL` pada fungsi `unduhDataCsv()` di `src/app.js`.
   * *Cara Memahaminya:* Kami meminta AI menjelaskan konsep `Blob` (Binary Large Object) yang membuat file virtual di RAM browser tanpa backend server, yang kemudian ditempelkan pada elemen tautan `<a>` download tersembunyi dan diklik secara otomatis lewat JavaScript.
