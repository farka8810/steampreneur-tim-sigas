/*
 * Test Bug #1: Validasi jumlah pesanan (qty)
 *
 * Aturan: Jumlah pesanan per produk harus bilangan bulat dari 1 sampai 99.
 * Jumlah kosong, nol, negatif, atau pecahan harus ditolak dengan pesan kesalahan.
 *
 * Bug: Sebelumnya tidak ada validasi qty sama sekali di fungsi tambahItem.
 */

const test = require("node:test");
const assert = require("node:assert");
const kasir = require("../kasir.js");

test("qty 0 harus ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", 0));
});

test("qty negatif harus ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", -1));
});

test("qty pecahan harus ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", 2.5));
});

test("qty 100 harus ditolak (melebihi batas 99)", () => {
  assert.throws(() => kasir.tambahItem([], "K01", 100));
});

test("qty string harus ditolak", () => {
  assert.throws(() => kasir.tambahItem([], "K01", "3"));
});

test("qty 1 harus diterima", () => {
  const keranjang = [];
  kasir.tambahItem(keranjang, "K01", 1);
  assert.strictEqual(keranjang[0].qty, 1);
});

test("qty 99 harus diterima", () => {
  const keranjang = [];
  kasir.tambahItem(keranjang, "K01", 99);
  assert.strictEqual(keranjang[0].qty, 99);
});
