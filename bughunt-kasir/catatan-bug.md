# Catatan Bug — Kasir Kantin STEAM

## Bug #1: Tidak ada validasi jumlah pesanan (qty)

- **Gejala:** Pengguna bisa memasukkan jumlah pesanan 0, negatif, pecahan (misal 2.5), atau lebih dari 99 tanpa pesan error. Aplikasi menerima semua input tersebut dan menambahkannya ke keranjang.
- **Langkah memunculkan bug:** Pada form "Tambah Pesanan", isi jumlah dengan 0 atau -1 atau 2.5 atau 100, lalu klik "Tambah". Produk akan masuk ke keranjang padahal seharusnya ditolak.
- **Aturan yang dilanggar:** Aturan #1 — "Jumlah pesanan per produk harus bilangan bulat dari 1 sampai 99. Jumlah kosong, nol, negatif, atau pecahan harus ditolak dengan pesan kesalahan."
- **Penyebab:** Di fungsi `tambahItem()` pada `kasir.js`, parameter `qty` langsung dipakai tanpa diperiksa terlebih dahulu. Tidak ada pengecekan apakah `qty` itu bilangan bulat, apakah nilainya minimal 1, atau apakah tidak melebihi 99. Jadi apapun yang dimasukkan user akan diterima begitu saja.
- **Perbaikan:** Ditambahkan pengecekan `if (!Number.isInteger(qty) || qty < 1 || qty > 99)` di awal fungsi `tambahItem()`. Jika tidak valid, fungsi melempar Error dengan pesan "Jumlah harus bilangan bulat dari 1 sampai 99".
- **Test yang membuktikan:** `tes/bug1-validasi-qty.test.js` — menguji qty 0, negatif, pecahan, >99, dan string ditolak; qty 1 dan 99 diterima.

---

## Bug #2: Diskon member dan diskon belanja digabung

- **Gejala:** Pelanggan member dengan subtotal di atas Rp100.000 mendapat diskon 15% (10% + 5%), padahal seharusnya hanya 10%. Contoh: subtotal Rp150.000, diskon jadi Rp22.500 (seharusnya Rp15.000).
- **Langkah memunculkan bug:** Centang "Pelanggan member", tambahkan pesanan sampai subtotal melebihi Rp100.000 (misal Nasi Goreng x 10 = Rp150.000). Lihat nilai diskon — sebelum diperbaiki menunjukkan Rp22.500 (15%), seharusnya Rp15.000 (10%).
- **Aturan yang dilanggar:** Aturan #4 — "Diskon tidak boleh digabung, hanya satu yang berlaku."
- **Penyebab:** Di fungsi `hitungDiskon()` pada `kasir.js`, kedua kondisi diskon ditulis sebagai dua `if` yang berdiri sendiri (bukan `if/else if`). Akibatnya, kalau member=true DAN subtotal > 100.000, kedua blok `if` sama-sama jalan dan diskonnya ditambahkan pakai `+=`. Jadi diskonnya 5% + 10% = 15%. Padahal spesifikasi bilang diskon tidak boleh digabung.
- **Perbaikan:** Mengubah logika menjadi `if (member) ... else if (subtotal > 100000) ...` sehingga hanya satu diskon yang berlaku. Member selalu dapat 10%, non-member dengan subtotal cukup dapat 5%.
- **Test yang membuktikan:** `tes/bug2-diskon-digabung.test.js` — menguji member+subtotal>100rb hanya dapat 10%; non-member+subtotal>100rb dapat 5%; dsb.

---

## Bug #3: Batas diskon non-member pakai `>` seharusnya `>=`

- **Gejala:** Non-member dengan subtotal tepat Rp100.000 tidak mendapat diskon 5%, padahal seharusnya dapat. Diskon baru muncul jika subtotal Rp100.001 ke atas.
- **Langkah memunculkan bug:** Jangan centang member. Tambahkan pesanan dengan subtotal tepat Rp100.000 (misal Nasi Goreng x 5 = Rp75.000 + Mie Ayam x 1 = Rp13.500 + Roti Bakar x 1 = Rp10.500 + Air Mineral x 1 = Rp3.500 — total sebenarnya perlu disesuaikan, atau langsung test fungsi `hitungDiskon(100000, false)`). Diskon menunjukkan Rp0, seharusnya Rp5.000.
- **Aturan yang dilanggar:** Aturan #4 — "Bukan member dengan subtotal **minimal** Rp100.000 mendapat diskon 5%." Kata "minimal" berarti termasuk tepat Rp100.000.
- **Penyebab:** Di fungsi `hitungDiskon()`, kondisi untuk diskon non-member ditulis `subtotal > 100000` (lebih besar dari). Operator `>` artinya 100.000 tidak termasuk. Padahal spesifikasi bilang "minimal Rp100.000" yang berarti harus pakai `>=` (lebih besar atau sama dengan).
- **Perbaikan:** Mengubah `subtotal > 100000` menjadi `subtotal >= 100000` di fungsi `hitungDiskon()`.
- **Test yang membuktikan:** `tes/bug3-batas-diskon.test.js` — menguji subtotal tepat 100.000 dapat diskon 5%; subtotal 99.999 tidak dapat diskon.
