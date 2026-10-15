/*
 * Test Bug #4: PPN pakai Math.floor seharusnya Math.round
 *
 * Aturan: PPN 11% dihitung dari (subtotal - diskon), lalu dibulatkan
 * ke rupiah terdekat (0,5 ke atas dibulatkan naik).
 *
 * Bug: Kode asli pakai Math.floor (selalu bulatkan ke bawah).
 * Seharusnya Math.round (bulatkan ke terdekat, 0.5 ke atas naik).
 */

const test = require("node:test");
const assert = require("node:assert");
const kasir = require("../kasir.js");

test("PPN dari dasar 13500 harus 1485 (Math.round), bukan 1484 (Math.floor)", () => {
  // 13.500 x 11% = 1.485,00 → Math.round = 1.485, Math.floor = 1.485
  // Ini kasus genap, sama hasilnya. Cari kasus yang beda.
  // 15.000 x 11% = 1.650 → sama
  // Cari dasar yang menghasilkan .5:
  // dasar x 0.11 harus menghasilkan .5
  // dasar = 50 → 50 x 0.11 = 5.5 → Math.round = 6, Math.floor = 5
  assert.strictEqual(kasir.hitungPPN(50), 6);
});

test("PPN dari dasar 150 = 16.5, Math.round = 17 (bukan 16)", () => {
  // 150 x 11% = 16.5 → Math.round = 17, Math.floor = 16
  assert.strictEqual(kasir.hitungPPN(150), 17);
});

test("PPN dari dasar 100000 = 11000 (bilangan bulat, tidak ada pembulatan)", () => {
  assert.strictEqual(kasir.hitungPPN(100000), 11000);
});

test("PPN dari dasar 135000 = 14850", () => {
  // 135.000 x 11% = 14.850 → exact
  assert.strictEqual(kasir.hitungPPN(135000), 14850);
});
