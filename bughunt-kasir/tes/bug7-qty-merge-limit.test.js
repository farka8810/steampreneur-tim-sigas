/*
 * Test Bug #7: Qty saat merge produk sama bisa melebihi 99
 *
 * Aturan: Total jumlah per produk tetap tidak boleh lebih dari 99.
 *
 * Bug: Saat produk yang sudah ada di keranjang ditambahkan lagi,
 * qty langsung dijumlahkan tanpa cek apakah totalnya melebihi 99.
 * Misal Es Teh sudah 90, tambah 20 → jadi 110.
 */

const test = require("node:test");
const assert = require("node:assert");
const kasir = require("../kasir.js");

test("merge qty yang melebihi 99 harus ditolak", () => {
  const keranjang = [];
  kasir.tambahItem(keranjang, "K04", 90); // Es Teh 90
  // Tambah 20 lagi → total 110, harus ditolak
  assert.throws(() => kasir.tambahItem(keranjang, "K04", 20));
  // qty tetap 90 (tidak berubah)
  assert.strictEqual(keranjang[0].qty, 90);
});

test("merge qty yang tepat 99 harus diterima", () => {
  const keranjang = [];
  kasir.tambahItem(keranjang, "K04", 50);
  kasir.tambahItem(keranjang, "K04", 49); // total 99, OK
  assert.strictEqual(keranjang[0].qty, 99);
});

test("merge qty yang jadi 100 harus ditolak", () => {
  const keranjang = [];
  kasir.tambahItem(keranjang, "K04", 50);
  assert.throws(() => kasir.tambahItem(keranjang, "K04", 50)); // total 100
  assert.strictEqual(keranjang[0].qty, 50); // tetap 50
});
