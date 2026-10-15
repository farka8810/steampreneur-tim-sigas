# Refleksi Tim

Dokumen ini berisi evaluasi jujur dan refleksi Tim SIGAS (Hanif Rizki Ardianto & Fabian Arkananta Firmansyah) selama menjalani challenge Vibe Engineering.

---

### 1. Apa yang berjalan baik dalam cara kami bekerja dengan AI?
Pemberian instruksi bertahap (*step-by-step prompting*) dengan konteks spesifik berjalan sangat efektif. Alih-alih meminta AI membangun seluruh aplikasi sekaligus, kami memecah instruksi per modul logika kecil (membuat validasi input form terlebih dahulu, lalu logika katup gas, lalu integrasi tampilan DOM). Cara kerja ini membuat kami berdua benar-benar memahami fungsi setiap baris kode yang dihasilkan AI, mempermudah pelacakan galat, dan menghasilkan riwayat commit kecil yang sering sesuai kaidah workflow sayembara.

### 2. Kapan AI paling membantu? Kapan AI justru menyulitkan?
* **Paling Membantu:** Saat menyusun struktur *boilerplate* CSS modern yang responsif, merumuskan pola Regular Expression untuk validasi jam operasional (`HH:MM`), dan menyusun kerangka unit test otomatis berbasis Node.js Native Test Runner.
* **Justru Menyulitkan:** Pada logika batas ambang (*edge cases*) dan format data spesifik. Sebagai contoh, AI sempat keliru menggunakan operator lebih besar murni (`>`) alih-alih lebih besar sama dengan (`>=`) pada batas darurat 1.000 PPM, serta memaksakan format teks `Rp` pada ekspor CSV yang justru merusak formula kalkulasi di Microsoft Excel. Di sini peran kami sebagai *Navigator* sangat krusial untuk mengoreksi dan mengarahkan AI.

### 3. Kesalahan terbesar yang hampir lolos, dan bagaimana kami menemukannya?
Kesalahan terbesar terjadi pada **logika ambang batas bahaya gas (PPM = 1000)**. AI awalnya menulis kondisi `if (ppm > 1000)` untuk memicu status DARURAT. Saat diuji kasus batas pada kasus uji U05 (tepat 1.000 PPM), katup gas ternyata tidak menutup otomatis dan statusnya masih WASPADA. Kami berhasil menemukannya karena kami telah menyusun kasus uji batas ambang secara manual di `docs/04-kasus-uji.md` sebelum meminta kode ke AI. Begitu hasil pengujian tidak cocok dengan hasil hitung manual kami, kami langsung merevisi kodenya menjadi `ppm >= 1000`.

### 4. Apa yang akan kami lakukan berbeda jika mengulang challenge ini?
Jika mengulang dari awal, kami akan menyiapkan modul pengujian unit test otomatis (*test runner*) sejak menit pertama sebelum menulis kode antarmuka HTML/CSS. Pada awal pengerjaan, kami sempat menguji form secara berulang-ulang dengan mengetik manual di peramban yang memakan waktu. Setelah unit test dibuat, proses verifikasi alur inti dan penambahan fitur baru (Change Request) berjalan jauh lebih cepat dan terbebas dari kesalahan regresi.

### 5. Bagaimana kami mengatur waktu? Langkah mana yang jauh lebih lama dari estimasi, dan kenapa?
Kami membagi fokus kerja secara jelas: Hanif memegang logika inti evaluasi katup, validasi form, dan arsitektur pengujian, sementara Fabian memegang keindahan tata letak dashboard, filter pencarian, dan integrasi ekspor data.
Langkah yang memakan waktu lebih lama dari estimasi awal adalah **Tahap 5 (Pengujian Kasus Uji dan Dokumentasi Bukti Screenshot)**. Memverifikasi setiap kemungkinan input salah (nilai negatif, kosong, nilai ekstrem) serta memastikan persistensi data LocalStorage saat browser dimuat ulang membutuhkan ketelitian ekstra. Namun, alokasi waktu fokus untuk Bug Hunt (60 menit) dan Change Request berhasil kami selesaikan dengan disiplin.

### 6. Bagian mana dari kode yang masih belum kami pahami sepenuhnya? (Jawab dengan jujur.)
Mekanisme internal manipulasi memori biner pada fungsi ekspor data CSV lokal yang menggunakan objek `Blob([csvContent])` dan pembuatan tautan virtual via `URL.createObjectURL(blob)` di `src/app.js`. Meskipun kami memahami alur logikanya (teks dikonversi menjadi biner di memori RAM lalu dipicu lewat tag tautan download), detail teknis tingkat rendah mengenai bagaimana mesin JavaScript browser mengalokasikan memori biner tersebut dan kapan browser otomatis membersihkannya jika tidak dipanggil `revokeObjectURL` masih merupakan materi lanjutan yang perlu kami pelajari lebih dalam di luar kompetisi ini.
