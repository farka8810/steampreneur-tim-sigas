# Rencana Kerja

Pecah pekerjaan menjadi langkah kecil. Mulai dari versi paling sederhana yang berfungsi, lalu tambahkan sedikit demi sedikit.
Satu langkah sebaiknya bisa dikerjakan dan diperiksa dalam 30 sampai 60 menit.
Tidak ada jadwal per jam, jadi rencana ini adalah jadwal tim kalian sendiri.

**Waktu mulai:** 13 Oktober 2026, 13:00 WIB  
**Batas akhir pengumpulan:** 14 Oktober 2026, 23:59 WIB  

| No | Langkah | Penanggung jawab | Cara memeriksa bahwa langkah ini selesai | Estimasi waktu | Waktu sebenarnya | Status |
|---|---|---|---|---|---|---|
| 1 | Scaffolding: Struktur proyek awal (`src/index.html`) | Hanif Rizki Ardianto | Kerangka semantik terbuka di browser tanpa error konsol | 30 menit | 25 menit | Selesai |
| 2 | Perancangan UI Dashboard: Styling antarmuka responsif (`src/style.css`) | Fabian Arkananta Firmansyah | Seluruh komponen kartu metrik, form, dan panel indikator tampil rapi dan proporsional | 45 menit | 40 menit | Selesai |
| 3 | Implementasi Validasi Form: Pengecekan input kosong, nilai negatif, dan format jam | Kevin Ho | Input salah (misal: PPM minus / nama kosong) memunculkan pesan error dan tidak tersimpan | 35 menit | 30 menit | Selesai |
| 4 | Mesin Aturan Bisnis: Logika Tri-State PPM (Normal, Waspada, Darurat) & kontrol katup otomatis | Hanif Rizki Ardianto | PPM 350 -> Normal/Buka, 400 -> Waspada/Buka, 1000 -> Darurat/Tutup, Kios tutup -> Katup Tutup | 40 menit | 35 menit | Selesai |
| 5 | Numerasi Finansial: Formula perhitungan Rasio Proteksi Aset terhadap investasi SIGAS | Kevin Ho | Aset Rp12,5 juta menghasilkan rasio proteksi tepat 6,8% dan aset Rp8,5 juta tepat 10,0% | 30 menit | 25 menit | Selesai |
| 6 | Integrasi LocalStorage & Tabel Rekap: Penyimpanan data persisten dan render live preview | Fabian Arkananta Firmansyah | Data kios yang diinput tersimpan di LocalStorage dan tetap muncul di tabel setelah refresh browser | 40 menit | 35 menit | Selesai |
| 7 | Pembuatan Unit Test Otomatis (`tes/sigas.test.js`) & Verifikasi Alur Inti (Checkpoint 2) | Hanif Rizki Ardianto | Perintah `node --test` mengeksekusi pengujian dan berstatus 100% PASS, kasus uji U01–U06 terverifikasi | 45 menit | 40 menit | Selesai |
| | Bug Hunt (Tugas 2: Aplikasi Kasir Kantin STEAM) | Hanif, Fabian, Kevin | Menemukan bug, menulis test, perbaikan per commit, dan mengisi `catatan-bug.md` | 60 menit | - | Belum Dimulai (Menunggu Checkpoint 2) |
| | Change Request (Tugas 3: Pencarian, Filter & Ekspor CSV) | Fabian Arkananta Firmansyah | Dokumen analisis di-commit lebih dulu, fitur berjalan, dan test lama tetap lulus | 45 menit | - | Belum Dimulai (Menunggu Checkpoint 2) |
| | Penjelasan Kode & Refleksi (Tugas 4 & Dokumentasi) | Hanif, Fabian, Kevin | `08-penjelasan-kode.md` lengkap per anggota dan README teruji How to Run | 50 menit | - | Belum Dimulai (Menunggu Checkpoint 2) |
