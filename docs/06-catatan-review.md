# Catatan Review Kode

Minta AI melakukan *code review* terhadap kode yang sudah dibuat. Catat saran yang diberikan, lalu putuskan saran mana yang diterima dan mana yang ditolak, beserta alasannya.

| No | Bagian Kode | Saran dari AI | Diterima / Ditolak | Alasan Keputusan Tim |
|---|---|---|---|---|
| 1 | `src/app.js` (Sanitasi HTML) | Menambahkan fungsi `escapeHtml()` sebelum menyuntikkan teks nama kios ke tabel innerHTML. | **Diterima** | Melindungi dashboard dari celah keamanan XSS (*Cross-Site Scripting*) jika nama kios memuat karakter tag HTML seperti `<script>`. |
| 2 | `src/app.js` (Pemisahan Logika) | Menyarankan memecah kode menjadi 10 modul file JS berbeda dengan Webpack/Vite bundler. | **Ditolak** | Membuat arsitektur terlalu rumit dan menambah ketergantungan *build step*. Untuk skala satu alur inti, menggunakan satu file `app.js` yang terstruktur jauh lebih mudah dipahami dan cepat dijalankan juri tanpa instalasi berlebih. |
| 3 | `src/app.js` (Ekspor Testing) | Menambahkan blok kondisional `if (typeof module !== 'undefined' && module.exports)` di akhir file. | **Diterima** | Memungkinkan fungsi aturan bisnis diuji secara headless oleh Node.js test runner tanpa merusak jalannya script di browser biasa. |
| 4 | `src/app.js` (Animasi Berat) | Menyarankan menambahkan library animasi 3D Three.js penuh ke dalam dashboard formulir. | **Ditolak** | Memperlambat waktu muat halaman web di perangkat tablet pengelola kios. Dashboard web difokuskan pada kecepatan akses dan kejelasan data (*clarity over decoration*). |
