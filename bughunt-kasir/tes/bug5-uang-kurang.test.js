/*
 * Test Bug #5: Kembalian tidak cek uang kurang
 *
 * Aturan: Jika uang yang dibayar kurang dari total, transaksi ditolak
 * dengan pesan "Uang pembayaran kurang". Jika cukup, kembalian = uang dibayar - total.
 *
 * Bug: Fungsi hitungKembalian() langsung menghitung bayar - total tanpa
 * memeriksa apakah bayar >= total. Jika bayar < total, hasilnya negatif
 * dan tidak ada pesan error.
 */

const test = require("node:test");
const assert = require("node:assert");
const kasir = require("../kasir.js");

test("bayar kurang dari total harus ditolak dengan error", () => {
  // Total 50.000, bayar 40.000
  assert.throws(
    () => kasir.hitungKembalian(50000, 40000),
    { message: "Uang pembayaran kurang" }
  );
});

test("bayar tepat sama dengan total, kembalian = 0", () => {
  assert.strictEqual(kasir.hitungKembalian(50000, 50000), 0);
});

test("bayar lebih dari total, kembalian dihitung benar", () => {
  assert.strictEqual(kasir.hitungKembalian(50000, 100000), 50000);
});
