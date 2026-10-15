# Catatan Bug Hunt: Kasir Kantin STEAM

**Nama tim:** Tim Sigas

## Bug 1
- **Gejala** (apa yang terlihat salah): Pengguna bisa memasukkan jumlah pesanan 0, negatif, pecahan (misal 2.5), atau lebih dari 99 tanpa pesan error. Aplikasi menerima semua input tersebut dan menambahkannya ke keranjang.
- **Langkah untuk memunculkan bug:** Pada form "Tambah Pesanan", isi jumlah dengan 0 atau -1 atau 2.5 atau 100, lalu klik "Tambah". Produk akan masuk ke keranjang padahal seharusnya ditolak.
- **Aturan bisnis yang dilanggar** (nomor aturan di README): Aturan #1 — "Jumlah pesanan per produk harus bilangan bulat dari 1 sampai 99. Jumlah kosong, nol, negatif, atau pecahan harus ditolak dengan pesan kesalahan."
- **Penyebab** (file, fungsi, dan penjelasan): File `kasir.js`, fungsi `tambahItem()`. Parameter `qty` langsung dipakai tanpa diperiksa terlebih dahulu. Tidak ada pengecekan apakah `qty` itu bilangan bulat, apakah nilainya minimal 1, atau apakah tidak melebihi 99. Jadi apapun yang dimasukkan user akan diterima begitu saja.
- **Perbaikan** (apa yang diubah): Ditambahkan pengecekan `if (!Number.isInteger(qty) || qty < 1 || qty > 99)` di awal fungsi `tambahItem()`. Jika tidak valid, fungsi melempar Error dengan pesan "Jumlah harus bilangan bulat dari 1 sampai 99".
- **Test yang membuktikan** (nama test): `tes/bug1-validasi-qty.test.js` — menguji qty 0, negatif, pecahan, >99, dan string ditolak; qty 1 dan 99 diterima.
- **Commit perbaikan** (pesan commit): `perbaikan: tambah validasi jumlah pesanan (qty harus integer 1-99)`
- **Ditemukan oleh:** bersama

## Bug 2
- **Gejala:** Pelanggan member dengan subtotal di atas Rp100.000 mendapat diskon 15% (10% + 5%), padahal seharusnya hanya 10%. Contoh: subtotal Rp150.000, diskon jadi Rp22.500 (seharusnya Rp15.000).
- **Langkah untuk memunculkan bug:** Centang "Pelanggan member", tambahkan pesanan sampai subtotal melebihi Rp100.000 (misal Nasi Goreng x 10 = Rp150.000). Lihat nilai diskon — sebelum diperbaiki menunjukkan Rp22.500 (15%), seharusnya Rp15.000 (10%).
- **Aturan bisnis yang dilanggar:** Aturan #4 — "Diskon tidak boleh digabung, hanya satu yang berlaku."
- **Penyebab:** File `kasir.js`, fungsi `hitungDiskon()`. Kedua kondisi diskon ditulis sebagai dua `if` yang berdiri sendiri (bukan `if/else if`). Akibatnya, kalau member=true DAN subtotal > 100.000, kedua blok `if` sama-sama jalan dan diskonnya ditambahkan pakai `+=`. Jadi diskonnya 5% + 10% = 15%.
- **Perbaikan:** Mengubah logika menjadi `if (member) ... else if (subtotal >= 100000) ...` sehingga hanya satu diskon yang berlaku. Member selalu dapat 10%, non-member dengan subtotal cukup dapat 5%.
- **Test yang membuktikan:** `tes/bug2-diskon-digabung.test.js` — menguji member+subtotal>100rb hanya dapat 10%; non-member+subtotal>100rb dapat 5%.
- **Commit perbaikan:** `perbaikan: diskon tidak boleh digabung, hanya satu yang berlaku`
- **Ditemukan oleh:** bersama

## Bug 3
- **Gejala:** Non-member dengan subtotal tepat Rp100.000 tidak mendapat diskon 5%, padahal seharusnya dapat. Diskon baru muncul jika subtotal Rp100.001 ke atas.
- **Langkah untuk memunculkan bug:** Jangan centang member. Panggil `hitungDiskon(100000, false)` — hasilnya 0, seharusnya 5.000.
- **Aturan bisnis yang dilanggar:** Aturan #4 — "Bukan member dengan subtotal **minimal** Rp100.000 mendapat diskon 5%." Kata "minimal" berarti termasuk tepat Rp100.000.
- **Penyebab:** File `kasir.js`, fungsi `hitungDiskon()`. Kondisi ditulis `subtotal > 100000` (pakai operator "lebih besar dari"). Operator `>` artinya 100.000 tidak termasuk. Padahal spesifikasi bilang "minimal Rp100.000" yang berarti harus pakai `>=` (lebih besar atau sama dengan).
- **Perbaikan:** Mengubah `subtotal > 100000` menjadi `subtotal >= 100000`.
- **Test yang membuktikan:** `tes/bug3-batas-diskon.test.js` — menguji subtotal tepat 100.000 dapat diskon 5%; subtotal 99.999 tidak dapat diskon.
- **Commit perbaikan:** `perbaikan: batas diskon non-member >= 100000 bukan > 100000`
- **Ditemukan oleh:** bersama

## Bug 4
- **Gejala:** Nilai PPN selalu dibulatkan ke bawah, padahal seharusnya dibulatkan ke rupiah terdekat (0,5 ke atas naik). Contoh: dasar pajak Rp150, PPN = 150 × 11% = 16,5 → aplikasi menampilkan Rp16, seharusnya Rp17.
- **Langkah untuk memunculkan bug:** Panggil `hitungPPN(150)` — hasilnya 16 (Math.floor), seharusnya 17 (Math.round). Atau panggil `hitungPPN(50)` — hasilnya 5 (Math.floor), seharusnya 6 (Math.round).
- **Aturan bisnis yang dilanggar:** Aturan #5 — "PPN 11% dihitung dari (subtotal dikurangi diskon), lalu dibulatkan ke rupiah terdekat (0,5 ke atas dibulatkan naik)."
- **Penyebab:** File `kasir.js`, fungsi `hitungPPN()`. Kode menggunakan `Math.floor()` yang selalu membulatkan ke bawah. Padahal spesifikasi bilang "dibulatkan ke rupiah terdekat (0,5 ke atas dibulatkan naik)", yang artinya harus pakai `Math.round()`. `Math.round()` membulatkan 0,5 ke atas, sesuai spesifikasi.
- **Perbaikan:** Mengubah `Math.floor(...)` menjadi `Math.round(...)` di fungsi `hitungPPN()`.
- **Test yang membuktikan:** `tes/bug4-ppn-pembulatan.test.js` — menguji PPN dari dasar 50 (hasilnya 6, bukan 5), dasar 150 (hasilnya 17, bukan 16).
- **Commit perbaikan:** `perbaikan: PPN dibulatkan ke rupiah terdekat (Math.round bukan Math.floor)`
- **Ditemukan oleh:** bersama

## Bug 5
- **Gejala:** Jika uang yang dibayar kurang dari total, aplikasi tetap menampilkan kembalian (bernilai negatif) tanpa pesan error. Contoh: total Rp50.000, bayar Rp40.000 → tampil "Kembalian: -Rp10.000".
- **Langkah untuk memunculkan bug:** Tambahkan pesanan ke keranjang, lalu isi uang bayar dengan jumlah yang lebih kecil dari total, klik "Bayar". Aplikasi menampilkan kembalian negatif tanpa error.
- **Aturan bisnis yang dilanggar:** Aturan #7 — "Jika uang yang dibayar kurang dari total, transaksi ditolak dengan pesan 'Uang pembayaran kurang'."
- **Penyebab:** File `kasir.js`, fungsi `hitungKembalian()`. Fungsi langsung menghitung `bayar - total` tanpa memeriksa terlebih dahulu apakah `bayar >= total`. Tidak ada pengecekan apapun, sehingga kalau bayar kurang, hasilnya jadi negatif dan tidak ada error yang dilempar.
- **Perbaikan:** Ditambahkan pengecekan `if (bayar < total) { throw new Error("Uang pembayaran kurang"); }` di awal fungsi sebelum menghitung kembalian.
- **Test yang membuktikan:** `tes/bug5-uang-kurang.test.js` — menguji bayar kurang ditolak dengan error; bayar tepat kembalian 0; bayar lebih kembalian benar.
- **Commit perbaikan:** `perbaikan: tolak pembayaran jika uang kurang dari total`
- **Ditemukan oleh:** bersama
