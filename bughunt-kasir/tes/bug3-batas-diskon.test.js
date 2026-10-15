/*
 * Test Bug #3: Batas diskon non-member pakai > seharusnya >=
 *
 * Aturan: Bukan member dengan subtotal MINIMAL Rp100.000 mendapat diskon 5%.
 *
 * Bug: Kode asli pakai operator > (lebih dari), sehingga subtotal tepat
 * Rp100.000 tidak mendapat diskon. Seharusnya >= (lebih dari atau sama dengan).
 */

const test = require("node:test");
const assert = require("node:assert");
const kasir = require("../kasir.js");

test("non-member subtotal tepat 100.000 harus dapat diskon 5%", () => {
  // Subtotal = 100.000, member = false
  // Seharusnya: 5% x 100.000 = 5.000
  // Bug lama: diskon = 0 (karena 100000 > 100000 = false)
  const diskon = kasir.hitungDiskon(100000, false);
  assert.strictEqual(diskon, 5000);
});

test("non-member subtotal 99.999 tidak dapat diskon", () => {
  const diskon = kasir.hitungDiskon(99999, false);
  assert.strictEqual(diskon, 0);
});

test("non-member subtotal 100.001 dapat diskon 5%", () => {
  const diskon = kasir.hitungDiskon(100001, false);
  assert.strictEqual(diskon, 5000);
});
