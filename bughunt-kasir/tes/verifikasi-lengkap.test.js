/*
 * Verifikasi menyeluruh berdasarkan spesifikasi resmi dari dokumen tugas.
 * Setiap aturan bisnis diuji dengan hitungan manual.
 */

const test = require("node:test");
const assert = require("node:assert");
const kasir = require("../kasir.js");

// ============================================================
// ATURAN 1: Qty harus bilangan bulat 1–99
// ============================================================
test("Aturan 1: qty kosong (NaN) ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", Number("")));
});
test("Aturan 1: qty nol ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", 0));
});
test("Aturan 1: qty negatif ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", -5));
});
test("Aturan 1: qty pecahan ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", 1.5));
});
test("Aturan 1: qty 100 ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", 100));
});

// ============================================================
// ATURAN 2: Produk sama dijumlahkan, total max 99
// ============================================================
test("Aturan 2: Es Teh 2 + Es Teh 3 = Es Teh 5", () => {
  const k = [];
  kasir.tambahItem(k, "K04", 2);
  kasir.tambahItem(k, "K04", 3);
  assert.strictEqual(k.length, 1); // hanya 1 baris
  assert.strictEqual(k[0].qty, 5);
});
test("Aturan 2: merge sampai tepat 99 boleh", () => {
  const k = [];
  kasir.tambahItem(k, "K01", 50);
  kasir.tambahItem(k, "K01", 49);
  assert.strictEqual(k[0].qty, 99);
});
test("Aturan 2: merge yang hasilnya 100 ditolak", () => {
  const k = [];
  kasir.tambahItem(k, "K01", 50);
  assert.throws(() => kasir.tambahItem(k, "K01", 50));
  assert.strictEqual(k[0].qty, 50); // tidak berubah
});

// ============================================================
// ATURAN 3: Subtotal = jumlah dari (harga × jumlah)
// ============================================================
test("Aturan 3: Nasi Goreng x3 + Es Teh x2", () => {
  const k = [];
  kasir.tambahItem(k, "K01", 3); // 15000 x 3 = 45000
  kasir.tambahItem(k, "K04", 2); // 4000 x 2 = 8000
  assert.strictEqual(kasir.hitungSubtotal(k), 53000);
});

// ============================================================
// ATURAN 4: Diskon — tidak boleh digabung
// ============================================================

// 4a: Member mendapat 10%
test("Aturan 4a: member subtotal 50000 → diskon 10% = 5000", () => {
  assert.strictEqual(kasir.hitungDiskon(50000, true), 5000);
});
test("Aturan 4a: member subtotal 150000 → diskon 10% = 15000 (BUKAN 15%)", () => {
  assert.strictEqual(kasir.hitungDiskon(150000, true), 15000);
});

// 4b: Non-member, subtotal minimal 100.000 → 5%
test("Aturan 4b: non-member subtotal 100000 → diskon 5% = 5000", () => {
  assert.strictEqual(kasir.hitungDiskon(100000, false), 5000);
});
test("Aturan 4b: non-member subtotal 200000 → diskon 5% = 10000", () => {
  assert.strictEqual(kasir.hitungDiskon(200000, false), 10000);
});

// 4c: Non-member subtotal < 100.000 → tidak ada diskon
test("Aturan 4c: non-member subtotal 99999 → diskon 0", () => {
  assert.strictEqual(kasir.hitungDiskon(99999, false), 0);
});

// 4d: Diskon dibulatkan ke rupiah terdekat
test("Aturan 4d: non-member subtotal 100001 → diskon 5% = 5000.05 → Math.round = 5000", () => {
  // 100001 * 5 / 100 = 5000.05 → Math.round = 5000
  assert.strictEqual(kasir.hitungDiskon(100001, false), 5000);
});
test("Aturan 4d: member subtotal 13500 → diskon 10% = 1350", () => {
  assert.strictEqual(kasir.hitungDiskon(13500, true), 1350);
});
test("Aturan 4d: member subtotal 8500 → diskon 10% = 850", () => {
  // 8500 * 10 / 100 = 850 exact
  assert.strictEqual(kasir.hitungDiskon(8500, true), 850);
});

// ============================================================
// ATURAN 5: PPN 11% dari (subtotal - diskon), dibulatkan terdekat
// ============================================================
test("Aturan 5: PPN dari 100000 = 11000", () => {
  assert.strictEqual(kasir.hitungPPN(100000), 11000);
});
test("Aturan 5: PPN dari 50 = 5.5 → Math.round = 6 (0,5 ke atas)", () => {
  assert.strictEqual(kasir.hitungPPN(50), 6);
});
test("Aturan 5: PPN dari 150 = 16.5 → Math.round = 17", () => {
  assert.strictEqual(kasir.hitungPPN(150), 17);
});
test("Aturan 5: PPN dari 95000 = 10450", () => {
  assert.strictEqual(kasir.hitungPPN(95000), 10450);
});

// ============================================================
// ATURAN 6: Total = subtotal - diskon + PPN
// ============================================================
test("Aturan 6: end-to-end non-member subtotal 100000", () => {
  // Subtotal = 100000
  // Diskon = 5% x 100000 = 5000
  // Dasar pajak = 100000 - 5000 = 95000
  // PPN = 11% x 95000 = 10450
  // Total = 95000 + 10450 = 105450
  const k = [];
  kasir.tambahItem(k, "K01", 5);  // Nasi Goreng 5 x 15000 = 75000
  kasir.tambahItem(k, "K04", 5);  // Es Teh 5 x 4000 = 20000
  kasir.tambahItem(k, "K07", 1);  // Air Mineral 1 x 3500 = 3500
  // Subtotal harus: 75000 + 20000 + 3500 = 98500... bukan 100000
  // Ganti pakai hitungRingkasan langsung dengan angka yang pas

  const k2 = [];
  kasir.tambahItem(k2, "K06", 4);  // Roti Bakar 4 x 10500 = 42000
  kasir.tambahItem(k2, "K01", 2);  // Nasi Goreng 2 x 15000 = 30000
  kasir.tambahItem(k2, "K03", 2);  // Soto Ayam 2 x 14000 = 28000
  // Subtotal = 42000 + 30000 + 28000 = 100000 ✓

  const r = kasir.hitungRingkasan(k2, false);
  assert.strictEqual(r.subtotal, 100000);
  assert.strictEqual(r.diskon, 5000);    // 5% x 100000
  assert.strictEqual(r.ppn, 10450);      // 11% x 95000
  assert.strictEqual(r.total, 105450);   // 95000 + 10450
});

test("Aturan 6: end-to-end member subtotal 13500", () => {
  // Mie Ayam x 1 = 13500
  // Diskon = 10% x 13500 = 1350
  // Dasar pajak = 13500 - 1350 = 12150
  // PPN = 11% x 12150 = 1336.5 → Math.round = 1337
  // Total = 12150 + 1337 = 13487
  const k = [];
  kasir.tambahItem(k, "K02", 1);
  const r = kasir.hitungRingkasan(k, true);
  assert.strictEqual(r.subtotal, 13500);
  assert.strictEqual(r.diskon, 1350);
  assert.strictEqual(r.ppn, 1337);       // Math.round(1336.5) = 1337
  assert.strictEqual(r.total, 13487);
});

test("Aturan 6: end-to-end non-member subtotal < 100000 (tanpa diskon)", () => {
  // Es Teh x 2 = 8000
  // Diskon = 0 (non-member, subtotal < 100000)
  // PPN = 11% x 8000 = 880
  // Total = 8000 + 880 = 8880
  const k = [];
  kasir.tambahItem(k, "K04", 2);
  const r = kasir.hitungRingkasan(k, false);
  assert.strictEqual(r.subtotal, 8000);
  assert.strictEqual(r.diskon, 0);
  assert.strictEqual(r.ppn, 880);
  assert.strictEqual(r.total, 8880);
});

// ============================================================
// ATURAN 7: Pembayaran — uang kurang ditolak, cukup → kembalian
// ============================================================
test("Aturan 7: bayar 8000 untuk total 8880 → ditolak", () => {
  assert.throws(
    () => kasir.hitungKembalian(8880, 8000),
    { message: "Uang pembayaran kurang" }
  );
});
test("Aturan 7: bayar 10000 untuk total 8880 → kembalian 1120", () => {
  assert.strictEqual(kasir.hitungKembalian(8880, 10000), 1120);
});
test("Aturan 7: bayar tepat sama → kembalian 0", () => {
  assert.strictEqual(kasir.hitungKembalian(8880, 8880), 0);
});
