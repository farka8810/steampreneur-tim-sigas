# Log Prompt

Catat prompt penting yang kalian berikan ke AI selama proses pengerjaan (Tahap 4 sampai 7), hasil yang diberikan AI, dan keputusan tim apakah menerimanya, menolaknya, atau meminta perbaikan.

> **Prinsip Vibe Engineering Tim SIGAS:**  
> Sesuai panduan sayembara, tim bertindak sebagai *Navigator* yang memegang kendali arsitektur, aturan bisnis, dan keamanan, sedangkan AI berperan sebagai *Driver* yang menuliskan kode per langkah kecil. Setiap prompt disusun dengan konteks yang jelas, aturan spesifik, batasan file, dan contoh angka konkret. Setiap output AI diuji secara kritis sebelum diterima.

---

## Tabel Ringkasan Log Prompt (Tahap 4 sampai 7)

| No | Tahap & Langkah | Prompt yang Diberikan ke AI | Hasil dari AI | Keputusan Tim & Catatan Navigator | Pesan Commit Terkait |
|---|---|---|---|---|---|
| 1 | **Tahap 4: Scaffolding**<br>*(Langkah 1: Kerangka HTML)* | "Kami dari Tim SIGAS (SMK Telkom Purwokerto) sedang membangun website 'SIGAS Web Sentinel' untuk sayembara STEAMpreneur 2026. Kami menggunakan HTML, CSS, dan JavaScript murni tanpa framework, tanpa bundler, dan tanpa dependensi eksternal. Website ini berfungsi sebagai sistem pemantauan kebocoran gas LPG dan kontrol katup otomatis untuk UMKM kuliner.<br><br>Pada langkah awal ini, buatkan kerangka semantik file `src/index.html`. Halaman harus memuat:<br>1. Header: Brand 'SIGAS Sentinel', tagline 'Sistem Integrasi Gas Aman &bull; Sentra UMKM Kuliner', badge status online, dan tombol '#btn-seed-data' ('Muat Contoh Data').<br>2. Metrics Summary Grid: 5 kartu metrik (#stat-total-kios, #stat-aman [< 400 PPM], #stat-waspada [400-999 PPM], #stat-darurat [&ge; 1000 PPM / jam tutup], dan #stat-total-aset).<br>3. Workspace Grid (2 Kolom):<br>   - Kolom kiri: Card '#kios-form' dengan input #input-nama-kios (wajib), dropdown #input-kategori (Warung Rames, Gorengan, Mie/Bakso, Minuman, Lainnya), input #input-nilai-aset (angka rupiah), input #input-jam-tutup (time, default 21:00), input #input-ppm-gas (angka PPM), checkbox #input-is-closed ('Kios Sudah Tutup Ditinggal'), tombol submit '#btn-submit' ('Evaluasi & Simpan Status Kios'), dan tombol '#btn-reset'. Sertakan wadah alert error (#error-alert) dan alert sukses (#success-alert).<br>   - Kolom kanan: Card '#preview-panel' live preview evaluasi status gas terkini (#eval-status-badge), visual gauge bar (#gauge-fill), bacaan PPM (#eval-ppm), kondisi katup (#eval-valve), tindakan sistem (#eval-action), rasio proteksi modal (#eval-rasio), dan teks formula (#eval-formula-text).<br>4. Section Rekapitulasi Data: Tabel '#table-kios' dengan header kolom (No, Nama Kios, Kategori, Nilai Aset, Jam Tutup, Bacaan Gas, Status Bahaya, Kondisi Katup, Rasio Proteksi, Aksi), tbody '#table-body', dan elemen '#empty-state' ('Data tidak ditemukan').<br>5. Footer resmi tim SIGAS dan tautan ke `style.css` serta `app.js`.<br><br>Fokus HANYA pada `src/index.html`. Jangan buat CSS atau JS dulu. Jelaskan struktur semantik yang kamu buat secara ringkas." | AI menghasilkan file `src/index.html` lengkap dengan seluruh elemen semantik, ID komponen yang konsisten, accessibility label, dan atribut form. | **Diterima**. Struktur ID elemen rapi, hierarki semantik HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`) sangat teratur dan sesuai rancangan alur inti. | `fitur: buat kerangka semantik dashboard dan formulir di index.html` |
| 2 | **Tahap 4: Desain Visual**<br>*(Langkah 2: Styling Vanilla CSS)* | "Melanjutkan proyek SIGAS Web Sentinel, sekarang buatkan file `src/style.css` untuk memberikan styling modern pada `src/index.html` yang sudah dibuat.<br><br>Kebutuhan styling:<br>1. Gunakan CSS Custom Properties (`:root`) untuk tema modern dark/industrial sentinel: latar belakang gelap slate (`--bg-primary: #0f172a`, `--bg-secondary: #1e293b`, `--bg-card: #1e293b`), teks putih dan abu-abu terang, warna status: Aman/Normal hijau (`#10b981`), Waspada kuning/oranye (`#f59e0b`), Bahaya merah terang (`#ef4444`), serta highlight rasio aset aksen cyan (`#06b6d4`).<br>2. Impor font 'Inter' untuk body dan 'JetBrains Mono' untuk nilai numerik/PPM.<br>3. Tata letak grid responsif untuk metrics cards (wrap fleksibel), workspace 2 kolom (form di kiri, live preview di kanan), dan tabel rekapitulasi data.<br>4. Desain form input yang nyaman: border transparan dengan efek hover/focus halus, label jelas, dan penanda teks error merah di bawah input.<br>5. Desain visual gauge bar untuk tingkat PPM gas dengan transisi lebar animasi (`transition: width 0.3s ease`).<br>6. Tampilan tabel dengan striping tipis, badge pil status, dan tombol aksi yang jelas.<br><br>Jangan ubah file `src/index.html`. Jelaskan secara singkat fitur CSS yang kamu gunakan." | AI menghasilkan file `src/style.css` dengan CSS Custom Properties yang terorganisir, tata letak grid responsif, styling gauge bar, dan tema modern dark sentinel. | **Diterima**. Antarmuka terlihat sangat profesional, modern, dan selaras dengan produk sistem proteksi gas keselamatan UMKM. | `fitur: implementasi styling antarmuka dashboard responsif di style.css` |
| 3 | **Tahap 4: Validasi Form**<br>*(Langkah 3: Logika Validasi Input)* | "Kami sedang menyusun logika JavaScript untuk SIGAS Web Sentinel di `src/app.js`. Pada langkah ini, buat HANYA fungsi validasi input form:<br>`function validasiInputKios(nama, aset, jamTutup, ppm)`<br><br>Aturan validasi bisnis yang wajib dipenuhi:<br>1. Nama Kios: tidak boleh kosong, bukan hanya spasi kosong (gunakan `.trim()`), dan minimal memiliki panjang 3 karakter.<br>2. Nilai Aset: wajib berupa angka positif lebih dari Rp0 (`> 0`). Nilai kosong, teks bukan angka, nol, atau negatif harus ditolak.<br>3. Jam Tutup: wajib dalam format jam waktu 24 jam valid `HH:MM` (gunakan pola Regular Expression `^([01]\\d|2[0-3]):([0-5]\\d)$`).<br>4. Bacaan Gas (PPM): wajib berupa angka antara 0 sampai 10.000 PPM (batas ukur sensor). Nilai kosong, teks non-angka, negatif (< 0), atau di atas 10.000 harus ditolak.<br><br>Fungsi harus mengembalikan objek `{ isValid: boolean, errors: { nama?: string, aset?: string, jam?: string, ppm?: string } }`. Buat fungsi ini sebagai *pure function* tanpa memanipulasi DOM agar bisa diuji secara headless di unit test. Di akhir file, tambahkan `if (typeof module !== 'undefined' && module.exports) { module.exports = { validasiInputKios }; }`. Jangan tulis kode DOM dulu. Jelaskan cara kerja validasi secara singkat." | AI membuat fungsi validasi, tetapi pada awalnya hanya memeriksa `if (!nama)` tanpa memotong spasi (`.trim()`) dan tanpa batas minimal karakter. | **Diperbaiki**. Tim meminta AI menambahkan pengecekan `nama.trim().length === 0` dan syarat minimal 3 karakter agar input spasi kosong atau 1 huruf ditolak (dicatat di `docs/05-kesalahan-ai.md` No. 3). | `fitur: buat fungsi validasi input form kios di app.js` |
| 4 | **Tahap 4: Aturan Bisnis**<br>*(Langkah 4: Logika Status Gas & Katup)* | "Melanjutkan `src/app.js`, sekarang buat fungsi aturan bisnis keselamatan gas SIGAS:<br>`function evaluasiStatusGas(ppm, isClosed = false)`<br><br>Aturan resmi dari spesifikasi produk:<br>1. Status Tingkat Bahaya Gas (Tri-State Logic):<br>   - NORMAL (Aman): jika PPM < 400. Status bahaya: 'NORMAL', Katup: 'TERBUKA', Tindakan: 'Siaga Normal (Kompor aman digunakan)', Badge: 'badge-normal'.<br>   - WASPADA (Rembesan Mikro): jika 400 <= PPM < 1000. Status bahaya: 'WASPADA', Katup: 'TERBUKA', Tindakan: 'Peringatan Rembesan Mikro (Periksa sambungan selang)', Badge: 'badge-waspada'.<br>   - DARURAT (Bahaya Bocor): jika PPM >= 1000. Status bahaya: 'DARURAT', Katup: 'TERTUTUP', Tindakan: 'BAHAYA BOCOR! Servo Otomatis Memutus Katup Gas', Badge: 'badge-darurat'.<br>2. Aturan Kios Tutup:<br>   - Jika parameter `isClosed === true`, katup regulator WAJIB 'TERTUTUP' otomatis meskipun konsentrasi gas normal (karena kios ditinggal semalaman tanpa pengawasan). Jika status bukan DARURAT, tindakannya: 'Kios Tutup: Katup Terkunci Aman via Jadwal RTC'.<br><br>Kembalikan objek: `{ ppm, statusBahaya, statusKatup, tindakan, badgeClass }`. PENTING: Perhatikan operator batas ambang tepat di angka 400 dan 1000 PPM. Ekspor fungsi ini di `module.exports`. Jelaskan kodenya." | AI membuat fungsi logika, namun awalnya menulis kondisi darurat menggunakan `if (ppm > 1000)` (lebih besar murni). Selain itu, AI sempat lupa mengunci katup jika `isClosed === true` saat gas normal. | **Diperbaiki**. Tim mengoreksi operator menjadi `if (ppm >= 1000)` agar tepat 1000 PPM katup langsung tertutup, serta menambahkan pengecekan `isClosed` (dicatat di `docs/05-kesalahan-ai.md` No. 1 & No. 4). | `fitur: implementasi logika evaluasi status gas dan katup otomatis` |
| 5 | **Tahap 4: Numerasi STEAM**<br>*(Langkah 5: Formula Rasio Proteksi)* | "Tambahkan konstanta dan fungsi perhitungan numerasi finansial STEAM di `src/app.js`:<br>`const BIAYA_SIGAS = 850000; // Biaya alat purwarupa SIGAS Rp850.000`<br>`function hitungRasioProteksi(nilaiAset)`<br><br>Aturan bisnis perhitungan:<br>1. Menghitung persentase beban biaya alat SIGAS terhadap total nilai aset modal usaha kios kuliner yang dilindungi dari kebakaran.<br>2. Rumus: `Rasio Proteksi (%) = (BIAYA_SIGAS / nilaiAset) * 100`.<br>3. Hasil dibulatkan ke satu desimal (`.toFixed(1)`) dan dikembalikan sebagai tipe data `Number`.<br>4. Penanganan nilai batas: jika `nilaiAset` bernilai 0, negatif, kosong, atau `NaN`, fungsi harus aman mengembalikan angka 0 untuk mencegah galat pembagian dengan nol (*division by zero*).<br>5. Contoh acuan: aset Rp12.500.000 menghasilkan tepat 6.8%; aset Rp8.500.000 menghasilkan tepat 10.0%.<br><br>Tambahkan fungsi dan konstanta ke `module.exports`. Jangan ubah kode lain. Jelaskan kodenya secara singkat." | AI menghasilkan konstanta `BIAYA_SIGAS` dan fungsi `hitungRasioProteksi` lengkap dengan pengaman `nilaiAset <= 0` dan konversi `Number(rasio.toFixed(1))`. | **Diterima**. Hasil perhitungan matematis sangat presisi, aman dari kasus nol/negatif, dan sesuai dengan target pengujian numerasi STEAM. | `fitur: tambah formula perhitungan rasio proteksi modal aset` |
| 6 | **Tahap 4: Integrasi DOM & Data**<br>*(Langkah 6: LocalStorage & Render)* | "Sekarang integrasikan fungsi logika di `src/app.js` dengan elemen antarmuka `src/index.html`.<br><br>Buat blok `document.addEventListener('DOMContentLoaded', ...)` yang memuat:<br>1. Live Preview Panel: Pasang event listener `input` pada input PPM dan nilai aset, serta `change` pada checkbox tutup. Setiap kali input berubah, perbarui elemen '#eval-status-badge', lebar visual '#gauge-fill', '#eval-ppm', '#eval-valve', '#eval-action', '#eval-rasio', dan teks formula '#eval-formula-text' secara real-time.<br>2. Submit Formulir: Pasang event listener submit pada '#kios-form'. Cegah reload (`e.preventDefault()`). Bersihkan pesan error lama. Jalankan `validasiInputKios()`. Jika ada error, tampilkan '#error-alert' dan pesan spesifik di field yang salah. Jika valid, panggil `evaluasiStatusGas()` dan `hitungRasioProteksi()`.<br>3. Bungkus menjadi objek kios baru dengan properti id (`kios-` + timestamp), nama, kategori, nilai aset, jam tutup, PPM, status bahaya, status katup, rasio, tindakan, dan createdAt.<br>4. Tambahkan objek ke array `records` (di posisi paling depan via `unshift`), simpan persisten ke LocalStorage dengan key `'sigas_sentinel_records'`, render tabel, dan update kartu metrik.<br>5. Buat fungsi `loadRecords()`, `saveRecords(data)`, dan `getSampleData()` (menyediakan 3 data bawaan: Warung Rames Mbak Sri, Ayam Goreng Mas Budi, Kios Mie & Bakso Barokah). Jika LocalStorage kosong, muat data contoh ini.<br>6. Buat fungsi `renderTable()` untuk mengisi `<tbody>` tabel dan fungsi `renderStats()` untuk memperbarui 5 kartu ringkasan metrik atas.<br>7. Buat fungsi helper `escapeHtml(text)` untuk sanitasi teks tabel dari celah XSS.<br><br>Pastikan kode aman dan modular. Jelaskan alur kerja data yang kamu susun." | AI menyusun seluruh kode event listener DOM, manipulasi tampilan live preview, manajemen LocalStorage, perenderan tabel dinamis, pembaruan metrik, dan sanitasi teks HTML. | **Diterima**. Alur inti dari pengisian form, validasi, evaluasi real-time, penyimpanan browser persisten, hingga pembaruan tabel berjalan mulus tanpa error konsol. | `fitur: integrasi interaksi form live preview dan localstorage` |
| 7 | **Tahap 5: Pengujian Otomatis**<br>*(Pembuatan Unit Test Node.js)* | "Berdasarkan kasus uji di `docs/04-kasus-uji.md` dan fungsi-fungsi yang telah diekspor dari `src/app.js`, buatkan file unit test otomatis `tes/sigas.test.js`.<br><br>Spesifikasi teknis pengujian:<br>1. Gunakan runner bawaan Node.js native (`node:test` dan `node:assert`). Uji harus dapat dijalankan dengan perintah terminal `node --test`.<br>2. Impor fungsi: `validasiInputKios`, `evaluasiStatusGas`, `hitungRasioProteksi`, `filterDataKios`, dan `getSampleData` dari `../src/app.js`.<br>3. Susun 5 skenario test case awal:<br>   - Test 1 (Validasi): Menolak nama kosong, aset <= 0, dan PPM negatif (sesuai Kasus Uji U01 & U02).<br>   - Test 2 (Status Normal): Memastikan PPM 350 menghasilkan status 'NORMAL' dan katup 'TERBUKA' (U03).<br>   - Test 3 (Batas Waspada): Memastikan PPM tepat 400 menghasilkan status 'WASPADA' dan katup 'TERBUKA' (U04).<br>   - Test 4 (Batas Darurat): Memastikan PPM tepat 1000 menghasilkan status 'DARURAT' dan katup 'TERTUTUP' (U05).<br>   - Test 5 (Numerasi STEAM): Memastikan aset Rp12.500.000 menghasilkan rasio tepat 6.8% dan aset Rp8.500.000 menghasilkan rasio tepat 10.0%.<br><br>Gunakan asersi ketat (`assert.strictEqual`). Jelaskan cara mengeksekusi test ini di terminal." | AI membuat file `tes/sigas.test.js` berisi 5 unit test terstruktur dengan asersi ketat `node:assert` tanpa dependensi eksternal. | **Diterima**. Seluruh 5 unit test berhasil lulus 100% (*5 passed*) saat dijalankan melalui perintah `node --test`. | `tes: tambah unit test otomatis untuk validasi dan aturan bisnis gas` |
| 8 | **Tahap 5: Verifikasi Alur Inti**<br>*(Pengujian Manual & Checkpoint 2)* | "Bantu kami memverifikasi hasil uji manual U01 sampai U06 di browser Chrome terhadap aplikasi SIGAS Sentinel. Berikut data pengujian lapangan kami:<br>- U01: Input PPM -50 -> Form menolak, alert merah muncul, data tidak tersimpan.<br>- U02: Input nama kosong & aset 0 -> Form menolak dengan pesan error nama & aset.<br>- U03: Kios Berkah, Aset 15.000.000, PPM 350 -> Status NORMAL (hijau), katup Terbuka, rasio 5.7%.<br>- U04: Warung Rames, Aset 12.500.000, PPM tepat 400 -> Status WASPADA (kuning), katup Terbuka, rasio 6.8%.<br>- U05: Ayam Goreng Mas Budi, Aset 8.500.000, PPM tepat 1000 -> Status DARURAT (merah), katup Tertutup, rasio 10.0%.<br>- U06: Simpan data, lalu muat ulang (refresh) browser -> Data tetap utuh dari LocalStorage.<br><br>Lengkapi Bagian B pada tabel `docs/04-kasus-uji.md` dengan status kelulusan dan referensi bukti tangkapan layar di folder `bukti/`. Konfirmasi apakah versi pertama alur inti ini sudah siap ditandai sebagai Checkpoint 2." | AI menyusun kembali tabel `docs/04-kasus-uji.md` dengan status 'Lulus' untuk semua kasus uji U01–U06 dan nama file tangkapan layar yang rapi. | **Diterima**. Semua pengujian manual dan otomatis lulus. Alur inti dinyatakan tuntas dan siap di-commit sebagai penanda Checkpoint 2. | `checkpoint: versi pertama alur inti berjalan` |
| 9 | **Tahap 6: Code Review**<br>*(Evaluasi Mandiri & Refaktor)* | "Lakukan *code review* mendalam terhadap seluruh file kode yang telah kami buat (`src/app.js`, `src/index.html`, dan `src/style.css`).<br><br>Evaluasi dari sudut pandang:<br>1. Kepatuhan Clean Code dan keterbacaan kode bagi pemula SMK.<br>2. Keamanan aplikasi web (khususnya celah XSS saat merender teks dari LocalStorage ke dalam tabel).<br>3. Efisiensi memori browser dan maintainability.<br>4. Kesesuaian dengan aturan Sayembara STEAMpreneur (tanpa framework rumit).<br><br>Sebutkan rekomendasi perbaikan spesifik dan beri alasan apakah rekomendasi tersebut krusial atau opsional." | AI memberikan 4 poin tinjauan: (1) Menyarankan fungsi `escapeHtml()` untuk sanitasi teks tabel; (2) Menyarankan memecah kode menjadi 10 modul file menggunakan bundler Vite; (3) Menambahkan ekspor kondisional `module.exports`; (4) Menyarankan penambahan library animasi 3D Three.js. | **Diputuskan Tim**: Tim menerima saran (1) sanitasi XSS dan (3) ekspor modul testing, namun **MENOLAK** saran (2) migrasi ke Vite dan (4) library 3D karena menambah kerumitan build yang tidak perlu bagi juri (dicatat di `docs/06-catatan-review.md`). | `refactor: terapkan sanitasi escapeHtml dan rapikan catatan review` |
| 10 | **Tugas 3: Analisis Change Request**<br>*(Analisis Dampak Sebelum Koding)* | "Panitia sayembara STEAMpreneur memberikan permintaan perubahan (*Change Request*):<br>'Data di website kalian akan terus bertambah dan pengguna mulai kesulitan menemukan data tertentu. Tambahkan pencarian dan filter di halaman daftar atau rekap, serta tombol untuk mengunduh data sebagai file CSV agar bisa diolah di Excel.'<br><br>Kriteria penerimaan:<br>1. Kotak pencarian case-insensitive real-time di tabel rekapitulasi.<br>2. Minimal satu filter (kategori/status) yang dapat dikombinasikan secara simultan dengan pencarian.<br>3. Pesan 'Data tidak ditemukan' jika hasil kosong.<br>4. Tombol Unduh CSV yang mengunduh data yang sedang aktif tampil dengan header kolom.<br>5. Angka di CSV ditulis sebagai angka mentah tanpa simbol mata uang `Rp` atau tanda titik pemisah ribuan.<br>6. Kasus uji lama tetap lulus.<br><br>Sesuai aturan sayembara (Tugas 3 Langkah 1), SEBELUM mengubah kode, kita wajib membuat dan meng-commit dokumen analisis dampak. Susun isi file `docs/analisis-change-request.md` yang memuat permintaan perubahan, kriteria penerimaan, komponen yang terdampak (HTML, CSS, JS, Test, README), dan rancangan kasus uji baru (CR-01 s.d CR-04). Jangan sentuh file kode dulu!" | AI menyusun draf dokumen `docs/analisis-change-request.md` lengkap dengan analisis dampak per file dan rancangan tabel pengujian baru CR-01 hingga CR-04. | **Diterima**. Analisis dampak disusun dan di-commit terlebih dahulu ke repositori GitHub sebelum perubahan kode dimulai, sesuai urutan wajib sayembara. | `dokumen: buat analisis dampak dan rancangan uji change request` |
| 11 | **Tugas 3: Implementasi Change Request**<br>*(Pencarian, Filter & Ekspor CSV)* | "Sekarang kita implementasikan Change Request sesuai dokumen `docs/analisis-change-request.md` yang telah di-commit.<br><br>Langkah perubahan terarah:<br>1. Pada `src/index.html`: Di atas tabel rekapitulasi, tambahkan toolbar memuat input pencarian `<input id='search-input' placeholder='Cari nama kios...'>`, dropdown filter `<select id='filter-status'>` (pilihan: SEMUA, NORMAL, WASPADA, DARURAT), dan tombol ekspor `<button id='btn-export-csv'>Unduh CSV (Excel)</button>`. Tambahkan elemen `#empty-state` dengan teks 'Data tidak ditemukan'.<br>2. Pada `src/app.js`:<br>   - Buat *pure function* `filterDataKios(kiosList, querySearch = '', filterStatus = 'SEMUA')` yang menyaring nama/kategori secara case-insensitive (`.toLowerCase()`) dan status bahaya. Ekspor fungsi ini di `module.exports`.<br>   - Buat fungsi `unduhDataCsv(dataList)` yang mengonversi data ke format CSV dengan baris pertama nama kolom. PENTING: Kolom Nilai Aset, PPM, dan Rasio Proteksi WAJIB ditulis sebagai ANGKA MURNI tanpa simbol `Rp` dan tanpa pemisah ribuan (misal: 12500000, bukan Rp12.500.000). Gunakan objek `Blob` dan `URL.createObjectURL` untuk memicu unduhan browser.<br>   - Hubungkan event listener `input` pada pencarian dan `change` pada filter ke fungsi `renderTable()`.<br>3. Pada `tes/sigas.test.js`: Tambahkan unit test ke-6 untuk memverifikasi fungsi `filterDataKios()` (uji pencarian nama, filter status, dan kombinasi kosong).<br><br>Pastikan semua alur uji lama tetap lulus. Jelaskan kodenya." | AI menambahkan toolbar di HTML, menyusun fungsi `filterDataKios` dan `unduhDataCsv` di `app.js`, serta menambahkan test ke-6 di `sigas.test.js`. Namun pada kode baris CSV awal, AI sempat memformat nilai aset dengan template string `"Rp${item.nilaiAset.toLocaleString('id-ID')}"`. | **Diperbaiki**. Tim menegur kesalahan AI dan mengoreksi kode generator CSV agar menulis angka mentah `item.nilaiAset` (misal: `12500000`) tanpa simbol Rp atau titik pemisah, sehingga Excel bisa langsung menjumlahkan angka tersebut (dicatat di `docs/05-kesalahan-ai.md` No. 2). | `fitur: tambah filter pencarian dan ekspor CSV angka murni` |
| 12 | **Tahap 7: Dokumentasi Repositori**<br>*(Penyusunan README & How to Run)* | "Bantu kami menyempurnakan `README.md` utama repositori sesuai spesifikasi wajib penilaian Vibe Engineering STEAMpreneur.<br><br>README wajib memuat bagian-bagian berikut:<br>1. Nama dan deskripsi produk: Apa yang dilakukan SIGAS Web Sentinel dan untuk siapa (pengelola sentra kuliner/kantin & pedagang UMKM).<br>2. Alur Inti: 3 langkah alur (Konfigurasi kios -> Evaluasi simulasi gas & katup -> Rekapitulasi data & proteksi aset).<br>3. Cara Menjalankan (How to Run): Prasyarat (Node.js v18+ jika ingin jalankan test, Browser Chrome/Firefox), perintah clone git, cara membuka langsung file `src/index.html` di browser tanpa server/bundler, dan cara memuat 3 data contoh bawaan.<br>4. Tangkapan layar alur inti: Rujukan gambar di folder `docs/bukti/`.<br>5. Cara Menjalankan Pengujian: Perintah terminal `node --test tes/sigas.test.js` dan hasil ekspektasi 6 test 100% lulus.<br>6. Fitur dan batasan sistem (fokus pada controller & simulator perangkat lunak web).<br>7. Struktur folder repositori lengkap.<br>8. Sumber dan lisensi aset (Google Fonts Inter & JetBrains Mono, lisensi SIL OFL).<br>9. Daftar anggota tim SIGAS dan perannya.<br><br>Tuliskan panduan langkah demi langkah yang teruji dan bebas dari asumsi lingkungan." | AI menyusun file `README.md` yang sangat lengkap, jelas, terstruktur, dan memuat panduan How to Run yang mudah diikuti oleh juri tanpa hambatan instalasi. | **Diterima**. Tim menguji ulang instruksi README di komputer bersih (*clean test*) dan memastikan seluruh langkah How to Run dapat dieksekusi dengan sempurna. | `dokumen: lengkapi README cara menjalankan dan informasi tim` |
| 13 | **Tahap 8: Pendalaman Konsep**<br>*(Konsultasi Penjelasan Kode & Refleksi)* | "Bantu kami memperdalam pemahaman teknis tim untuk bahan penulisan dokumen evaluasi mandiri `docs/08-penjelasan-kode.md` dan `docs/07-refleksi.md`.<br><br>Jelaskan secara konseptual dan gamblang tiga pertanyaan berikut:<br>1. Bagaimana prinsip kerja objek `Blob` dan `URL.createObjectURL(blob)` saat fungsi `unduhDataCsv()` membuat file CSV langsung di memori peramban tanpa bantuan server backend?<br>2. Mengapa ekspresi reguler `^([01]\\d|2[0-3]):([0-5]\\d)$` pada validasi jam tutup dapat mencegah input waktu tidak valid seperti '25:70' atau '99:00'?<br>3. Apa korelasi matematis antara formula rasio proteksi modal `(BIAYA_SIGAS / Nilai Aset) * 100` dengan pilar Mathematics dan Business Viability dalam STEAMPreneur?<br><br>Berikan penjelasan konsep dasarnya saja. Kami akan mendiskusikan kembali dan menuliskan jawabannya dengan gaya bahasa serta pemikiran kami sendiri sesuai pembagian anggota tim." | AI menguraikan cara kerja alokasi memori Blob biner di RAM browser, diagram alir sintaks regex waktu, serta interpretasi ekonomi dari rasio proteksi aset modal UMKM. | **Diterima**. Penjelasan AI dipelajari oleh seluruh anggota tim (Hanif, Fabian, Kevin), kemudian tim menuliskan dokumen `08-penjelasan-kode.md` dan `07-refleksi.md` secara mandiri menggunakan bahasa siswa sendiri. | `dokumen: selesaikan penjelasan kode per anggota dan refleksi tim` |

---

## Salinan Lengkap Prompt per Langkah (Siap Pakai untuk Eksekusi Mandiri)

Gunakan naskah prompt terstruktur di bawah ini saat melakukan prompt manual satu per satu kepada asisten AI di repositori baru Anda:

### Langkah 1 — Scaffolding Semantik `src/index.html`
```text
Kami dari Tim SIGAS (SMK Telkom Purwokerto) sedang membangun website 'SIGAS Web Sentinel' untuk sayembara STEAMpreneur 2026. Kami menggunakan HTML, CSS, dan JavaScript murni tanpa framework, tanpa bundler, dan tanpa dependensi eksternal. Website ini berfungsi sebagai sistem pemantauan kebocoran gas LPG dan kontrol katup otomatis untuk UMKM kuliner.

Pada langkah awal ini, buatkan kerangka semantik file src/index.html. Halaman harus memuat:
1. Header: Brand 'SIGAS Sentinel', tagline 'Sistem Integrasi Gas Aman • Sentra UMKM Kuliner', badge status online, dan tombol '#btn-seed-data' ('Muat Contoh Data').
2. Metrics Summary Grid: 5 kartu metrik (#stat-total-kios, #stat-aman [< 400 PPM], #stat-waspada [400-999 PPM], #stat-darurat [>= 1000 PPM / jam tutup], dan #stat-total-aset).
3. Workspace Grid (2 Kolom):
   - Kolom kiri: Card '#kios-form' dengan input #input-nama-kios (wajib), dropdown #input-kategori (Warung Rames, Gorengan, Mie/Bakso, Minuman, Lainnya), input #input-nilai-aset (angka rupiah), input #input-jam-tutup (time, default 21:00), input #input-ppm-gas (angka PPM), checkbox #input-is-closed ('Kios Sudah Tutup Ditinggal'), tombol submit '#btn-submit' ('Evaluasi & Simpan Status Kios'), dan tombol '#btn-reset'. Sertakan wadah alert error (#error-alert) dan alert sukses (#success-alert).
   - Kolom kanan: Card '#preview-panel' live preview evaluasi status gas terkini (#eval-status-badge), visual gauge bar (#gauge-fill), bacaan PPM (#eval-ppm), kondisi katup (#eval-valve), tindakan sistem (#eval-action), rasio proteksi modal (#eval-rasio), dan teks formula (#eval-formula-text).
4. Section Rekapitulasi Data: Tabel '#table-kios' dengan header kolom (No, Nama Kios, Kategori, Nilai Aset, Jam Tutup, Bacaan Gas, Status Bahaya, Kondisi Katup, Rasio Proteksi, Aksi), tbody '#table-body', dan elemen '#empty-state' ('Data tidak ditemukan').
5. Footer resmi tim SIGAS dan tautan ke style.css serta app.js.

Fokus HANYA pada src/index.html. Jangan buat CSS atau JS dulu. Jelaskan struktur semantik yang kamu buat secara ringkas.
```

### Langkah 2 — Desain Antarmuka & Responsivitas `src/style.css`
```text
Melanjutkan proyek SIGAS Web Sentinel, sekarang buatkan file src/style.css untuk memberikan styling modern pada src/index.html yang sudah dibuat.

Kebutuhan styling:
1. Gunakan CSS Custom Properties (:root) untuk tema modern dark/industrial sentinel: latar belakang gelap slate (--bg-primary: #0f172a, --bg-secondary: #1e293b, --bg-card: #1e293b), teks putih dan abu-abu terang, warna status: Aman/Normal hijau (#10b981), Waspada kuning/oranye (#f59e0b), Bahaya merah terang (#ef4444), serta highlight rasio aset aksen cyan (#06b6d4).
2. Impor font 'Inter' untuk body dan 'JetBrains Mono' untuk nilai numerik/PPM.
3. Tata letak grid responsif untuk metrics cards (wrap fleksibel), workspace 2 kolom (form di kiri, live preview di kanan), dan tabel rekapitulasi data.
4. Desain form input yang nyaman: border transparan dengan efek hover/focus halus, label jelas, dan penanda teks error merah di bawah input.
5. Desain visual gauge bar untuk tingkat PPM gas dengan transisi lebar animasi (transition: width 0.3s ease).
6. Tampilan tabel dengan striping tipis, badge pil status, dan tombol aksi yang jelas.

Jangan ubah file src/index.html. Jelaskan secara singkat fitur CSS yang kamu gunakan.
```

### Langkah 3 — Fungsi Validasi Formulir di `src/app.js`
```text
Kami sedang menyusun logika JavaScript untuk SIGAS Web Sentinel di src/app.js. Pada langkah ini, buat HANYA fungsi validasi input form:
function validasiInputKios(nama, aset, jamTutup, ppm)

Aturan validasi bisnis yang wajib dipenuhi:
1. Nama Kios: tidak boleh kosong, bukan hanya spasi kosong (gunakan .trim()), dan minimal memiliki panjang 3 karakter.
2. Nilai Aset: wajib berupa angka positif lebih dari Rp0 (> 0). Nilai kosong, teks bukan angka, nol, atau negatif harus ditolak.
3. Jam Tutup: wajib dalam format jam waktu 24 jam valid HH:MM (gunakan pola Regular Expression ^([01]\d|2[0-3]):([0-5]\d)$).
4. Bacaan Gas (PPM): wajib berupa angka antara 0 sampai 10.000 PPM (batas ukur sensor). Nilai kosong, teks non-angka, negatif (< 0), atau di atas 10.000 harus ditolak.

Fungsi harus mengembalikan objek:
{
    isValid: boolean,
    errors: { nama?: string, aset?: string, jam?: string, ppm?: string }
}

Buat fungsi ini sebagai pure function tanpa memanipulasi DOM agar bisa diuji secara headless di unit test. Di akhir file, tambahkan:
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validasiInputKios };
}

Jangan tulis kode DOM dulu. Jelaskan cara kerja validasi secara singkat.
```

### Langkah 4 — Mesin Logika Status Gas & Katup Otomatis di `src/app.js`
```text
Melanjutkan src/app.js, sekarang buat fungsi aturan bisnis keselamatan gas SIGAS:
function evaluasiStatusGas(ppm, isClosed = false)

Aturan resmi dari spesifikasi produk:
1. Status Tingkat Bahaya Gas (Tri-State Logic):
   - NORMAL (Aman): jika PPM < 400. Status bahaya: 'NORMAL', Katup: 'TERBUKA', Tindakan: 'Siaga Normal (Kompor aman digunakan)', Badge: 'badge-normal'.
   - WASPADA (Rembesan Mikro): jika 400 <= PPM < 1000. Status bahaya: 'WASPADA', Katup: 'TERBUKA', Tindakan: 'Peringatan Rembesan Mikro (Periksa sambungan selang)', Badge: 'badge-waspada'.
   - DARURAT (Bahaya Bocor): jika PPM >= 1000. Status bahaya: 'DARURAT', Katup: 'TERTUTUP', Tindakan: 'BAHAYA BOCOR! Servo Otomatis Memutus Katup Gas', Badge: 'badge-darurat'.
2. Aturan Kios Tutup:
   - Jika parameter isClosed === true, katup regulator WAJIB 'TERTUTUP' otomatis meskipun konsentrasi gas normal (karena kios ditinggal semalaman tanpa pengawasan). Jika status bukan DARURAT, tindakannya: 'Kios Tutup: Katup Terkunci Aman via Jadwal RTC'.

Kembalikan objek:
{ ppm, statusBahaya, statusKatup, tindakan, badgeClass }

PENTING: Perhatikan operator batas ambang tepat di angka 400 dan 1000 PPM (gunakan >= 1000 untuk Darurat). Ekspor fungsi ini di module.exports bersama fungsi sebelumnya. Jelaskan kodenya secara ringkas.
```

### Langkah 5 — Numerasi STEAM Rasio Proteksi Modal di `src/app.js`
```text
Tambahkan konstanta dan fungsi perhitungan numerasi finansial STEAM di src/app.js:
const BIAYA_SIGAS = 850000; // Biaya alat purwarupa SIGAS Rp850.000
function hitungRasioProteksi(nilaiAset)

Aturan bisnis perhitungan:
1. Menghitung persentase beban biaya alat SIGAS terhadap total nilai aset modal usaha kios kuliner yang dilindungi dari kebakaran.
2. Rumus: Rasio Proteksi (%) = (BIAYA_SIGAS / nilaiAset) * 100.
3. Hasil dibulatkan ke satu desimal (.toFixed(1)) dan dikembalikan sebagai tipe data Number.
4. Penanganan nilai batas: jika nilaiAset bernilai 0, negatif, kosong, atau NaN, fungsi harus aman mengembalikan angka 0 untuk mencegah galat pembagian dengan nol (division by zero).
5. Contoh acuan: aset Rp12.500.000 menghasilkan tepat 6.8%; aset Rp8.500.000 menghasilkan tepat 10.0%.

Tambahkan fungsi dan konstanta ke module.exports. Jangan ubah kode lain. Jelaskan kodenya secara singkat.
```

### Langkah 6 — Integrasi Interaksi DOM, LocalStorage & Render Tabel di `src/app.js`
```text
Sekarang integrasikan fungsi logika di src/app.js dengan elemen antarmuka src/index.html.

Buat blok document.addEventListener('DOMContentLoaded', ...) yang memuat:
1. Live Preview Panel: Pasang event listener 'input' pada input PPM dan nilai aset, serta 'change' pada checkbox tutup. Setiap kali input berubah, perbarui elemen '#eval-status-badge', lebar visual '#gauge-fill', '#eval-ppm', '#eval-valve', '#eval-action', '#eval-rasio', dan teks formula '#eval-formula-text' secara real-time.
2. Submit Formulir: Pasang event listener submit pada '#kios-form'. Cegah reload (e.preventDefault()). Bersihkan pesan error lama. Jalankan validasiInputKios(). Jika ada error, tampilkan '#error-alert' dan pesan spesifik di field yang salah. Jika valid, panggil evaluasiStatusGas() dan hitungRasioProteksi().
3. Bungkus menjadi objek kios baru dengan properti id ('kios-' + timestamp), nama, kategori, nilai aset, jam tutup, PPM, status bahaya, status katup, rasio, tindakan, dan createdAt.
4. Tambahkan objek ke array records (di posisi paling depan via unshift), simpan persisten ke LocalStorage dengan key 'sigas_sentinel_records', render tabel, dan update kartu metrik.
5. Buat fungsi loadRecords(), saveRecords(data), dan getSampleData() (menyediakan 3 data bawaan: Warung Rames Mbak Sri, Ayam Goreng Mas Budi, Kios Mie & Bakso Barokah). Jika LocalStorage kosong, muat data contoh ini.
6. Buat fungsi renderTable() untuk mengisi <tbody> tabel dan fungsi renderStats() untuk memperbarui 5 kartu ringkasan metrik atas.
7. Buat fungsi helper escapeHtml(text) untuk sanitasi teks tabel dari celah XSS.

Pastikan kode aman dan modular. Jelaskan alur kerja data yang kamu susun.
```

### Langkah 7 — Unit Test Otomatis Node.js di `tes/sigas.test.js`
```text
Berdasarkan kasus uji di docs/04-kasus-uji.md dan fungsi-fungsi yang telah diekspor dari src/app.js, buatkan file unit test otomatis tes/sigas.test.js.

Spesifikasi teknis pengujian:
1. Gunakan runner bawaan Node.js native (node:test dan node:assert). Uji harus dapat dijalankan dengan perintah terminal: node --test
2. Impor fungsi: validasiInputKios, evaluasiStatusGas, hitungRasioProteksi, filterDataKios, dan getSampleData dari ../src/app.js.
3. Susun skenario test case awal:
   - Test 1 (Validasi): Menolak nama kosong, aset <= 0, dan PPM negatif (sesuai Kasus Uji U01 & U02).
   - Test 2 (Status Normal): Memastikan PPM 350 menghasilkan status 'NORMAL' dan katup 'TERBUKA' (U03).
   - Test 3 (Batas Waspada): Memastikan PPM tepat 400 menghasilkan status 'WASPADA' dan katup 'TERBUKA' (U04).
   - Test 4 (Batas Darurat): Memastikan PPM tepat 1000 menghasilkan status 'DARURAT' dan katup 'TERTUTUP' (U05).
   - Test 5 (Numerasi STEAM): Memastikan aset Rp12.500.000 menghasilkan rasio tepat 6.8% dan aset Rp8.500.000 menghasilkan rasio tepat 10.0%.

Gunakan asersi ketat (assert.strictEqual). Jelaskan cara mengeksekusi test ini di terminal.
```

### Langkah 8 — Analisis Dampak Change Request di `docs/analisis-change-request.md`
```text
Panitia sayembara STEAMpreneur memberikan permintaan perubahan (Change Request):
"Data di website kalian akan terus bertambah dan pengguna mulai kesulitan menemukan data tertentu. Tambahkan pencarian dan filter di halaman daftar atau rekap, serta tombol untuk mengunduh data sebagai file CSV agar bisa diolah di Excel."

Kriteria penerimaan:
1. Kotak pencarian case-insensitive real-time di tabel rekapitulasi.
2. Minimal satu filter (kategori/status) yang dapat dikombinasikan secara simultan dengan pencarian.
3. Pesan "Data tidak ditemukan" jika hasil kosong.
4. Tombol Unduh CSV yang mengunduh data yang sedang aktif tampil dengan header kolom.
5. Angka di CSV ditulis sebagai angka mentah tanpa simbol mata uang Rp atau tanda titik pemisah ribuan.
6. Kasus uji lama tetap lulus.

Sesuai aturan sayembara (Tugas 3 Langkah 1), SEBELUM mengubah kode, kita wajib membuat dan meng-commit dokumen analisis dampak. Susun isi file docs/analisis-change-request.md yang memuat:
- Permintaan perubahan
- Kriteria penerimaan
- Komponen yang terdampak (HTML, CSS, JS, Test, README)
- Rancangan kasus uji baru (CR-01 s.d CR-04)

Jangan ubah file kode dulu! Tuliskan analisisnya secara mendalam.
```

### Langkah 9 — Implementasi Change Request (Filter & Ekspor CSV) di `src/` & `tes/`
```text
Sekarang kita implementasikan Change Request sesuai dokumen docs/analisis-change-request.md yang telah di-commit.

Langkah perubahan terarah:
1. Pada src/index.html: Di atas tabel rekapitulasi, tambahkan toolbar memuat input pencarian <input id='search-input' placeholder='Cari nama kios...'>, dropdown filter <select id='filter-status'> (pilihan: SEMUA, NORMAL, WASPADA, DARURAT), dan tombol ekspor <button id='btn-export-csv'>Unduh CSV (Excel)</button>. Tambahkan elemen #empty-state dengan teks 'Data tidak ditemukan'.
2. Pada src/app.js:
   - Buat pure function filterDataKios(kiosList, querySearch = '', filterStatus = 'SEMUA') yang menyaring nama/kategori secara case-insensitive (.toLowerCase()) dan status bahaya. Ekspor fungsi ini di module.exports.
   - Buat fungsi unduhDataCsv(dataList) yang mengonversi data ke format CSV dengan baris pertama nama kolom. PENTING: Kolom Nilai Aset, PPM, dan Rasio Proteksi WAJIB ditulis sebagai ANGKA MURNI tanpa simbol Rp dan tanpa pemisah ribuan (misal: 12500000, bukan Rp12.500.000). Gunakan objek Blob dan URL.createObjectURL untuk memicu unduhan browser.
   - Hubungkan event listener input pada pencarian dan change pada filter ke fungsi renderTable().
3. Pada tes/sigas.test.js: Tambahkan unit test ke-6 untuk memverifikasi fungsi filterDataKios() (uji pencarian nama, filter status, dan kombinasi kosong).

Pastikan semua alur uji lama tetap lulus. Jelaskan kode baru yang ditambahkan secara singkat.
```

### Langkah 10 — Penyusunan `README.md` Utama & Panduan How to Run
```text
Bantu kami menyempurnakan README.md utama repositori sesuai spesifikasi wajib penilaian Vibe Engineering STEAMpreneur.

README wajib memuat bagian-bagian berikut:
1. Nama dan deskripsi produk: Apa yang dilakukan SIGAS Web Sentinel dan untuk siapa (pengelola sentra kuliner/kantin & pedagang UMKM).
2. Alur Inti: 3 langkah alur (Konfigurasi kios -> Evaluasi simulasi gas & katup -> Rekapitulasi data & proteksi aset).
3. Cara Menjalankan (How to Run): Prasyarat (Node.js v18+ jika ingin jalankan test, Browser Chrome/Firefox), perintah clone git, cara membuka langsung file src/index.html di browser tanpa server/bundler, dan cara memuat 3 data contoh bawaan.
4. Tangkapan layar alur inti: Rujukan gambar di folder docs/bukti/.
5. Cara Menjalankan Pengujian: Perintah terminal `node --test tes/sigas.test.js` dan hasil ekspektasi 6 test 100% lulus.
6. Fitur dan batasan sistem (fokus pada controller & simulator perangkat lunak web).
7. Struktur folder repositori lengkap.
8. Sumber dan lisensi aset (Google Fonts Inter & JetBrains Mono, lisensi SIL OFL).
9. Daftar anggota tim SIGAS dan perannya.

Tuliskan panduan langkah demi langkah yang teruji dan bebas dari asumsi lingkungan.
```
