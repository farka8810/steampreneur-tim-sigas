# Catatan Bug — Kasir Kantin STEAM

## Bug #1: Tidak ada validasi jumlah pesanan (qty)

- **Gejala:** Pengguna bisa memasukkan jumlah pesanan 0, negatif, pecahan (misal 2.5), atau lebih dari 99 tanpa pesan error. Aplikasi menerima semua input tersebut dan menambahkannya ke keranjang.
- **Langkah memunculkan bug:** Pada form "Tambah Pesanan", isi jumlah dengan 0 atau -1 atau 2.5 atau 100, lalu klik "Tambah". Produk akan masuk ke keranjang padahal seharusnya ditolak.
- **Aturan yang dilanggar:** Aturan #1 — "Jumlah pesanan per produk harus bilangan bulat dari 1 sampai 99. Jumlah kosong, nol, negatif, atau pecahan harus ditolak dengan pesan kesalahan."
- **Penyebab:** Di fungsi `tambahItem()` pada `kasir.js`, parameter `qty` langsung dipakai tanpa diperiksa terlebih dahulu. Tidak ada pengecekan apakah `qty` itu bilangan bulat, apakah nilainya minimal 1, atau apakah tidak melebihi 99. Jadi apapun yang dimasukkan user akan diterima begitu saja.
- **Perbaikan:** Ditambahkan pengecekan `if (!Number.isInteger(qty) || qty < 1 || qty > 99)` di awal fungsi `tambahItem()`. Jika tidak valid, fungsi melempar Error dengan pesan "Jumlah harus bilangan bulat dari 1 sampai 99".
- **Test yang membuktikan:** `tes/bug1-validasi-qty.test.js` — menguji qty 0, negatif, pecahan, >99, dan string ditolak; qty 1 dan 99 diterima.
