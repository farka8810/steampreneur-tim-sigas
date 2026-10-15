/*
 * Test Bug #6: Qty dikirim sebagai string dari form
 *
 * Aturan: Jumlah pesanan harus bilangan bulat dari 1 sampai 99.
 * Jika produk sudah ada di keranjang, jumlahnya dijumlahkan.
 *
 * Bug: Di app.js, elQty.value adalah string (misal "3"). Ketika dikirim
 * ke tambahItem() tanpa dikonversi, qty bertipe string. Ini menyebabkan:
 * - Validasi Number.isInteger("3") = false, selalu ditolak
 * - Tanpa validasi, penambahan qty jadi string concatenation ("2" + "3" = "23")
 *
 * Perbaikan ada di app.js (Number(elQty.value)), tapi test ini membuktikan
 * bahwa tambahItem hanya menerima number, bukan string.
 */

const test = require("node:test");
const assert = require("node:assert");
const kasir = require("../kasir.js");

test("tambahItem menolak qty bertipe string", () => {
  // Simulasi: elQty.value = "3" (string dari form HTML)
  assert.throws(() => kasir.tambahItem([], "K01", "3"));
});

test("tambahItem menerima qty bertipe number (setelah konversi)", () => {
  // Simulasi: Number(elQty.value) = Number("3") = 3
  const keranjang = [];
  kasir.tambahItem(keranjang, "K01", Number("3"));
  assert.strictEqual(keranjang[0].qty, 3);
});

test("penambahan qty produk sama menghasilkan penjumlahan, bukan concatenation", () => {
  const keranjang = [];
  kasir.tambahItem(keranjang, "K04", 2);
  kasir.tambahItem(keranjang, "K04", 3);
  // Harus 5, bukan "23" (string concatenation)
  assert.strictEqual(keranjang[0].qty, 5);
});
