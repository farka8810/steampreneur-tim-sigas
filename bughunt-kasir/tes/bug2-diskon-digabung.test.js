/*
 * Test Bug #2: Diskon tidak boleh digabung
 *
 * Aturan: Diskon tidak boleh digabung, hanya satu yang berlaku.
 * - Member mendapat diskon 10% dari subtotal.
 * - Bukan member dengan subtotal >= 100.000 mendapat diskon 5%.
 * - Selain itu, tidak ada diskon.
 *
 * Bug: Sebelumnya diskon member (10%) dan diskon subtotal (5%) bisa
 * digabung menjadi 15% karena kedua if berdiri sendiri.
 */

const test = require("node:test");
const assert = require("node:assert");
const kasir = require("../kasir.js");

test("member dengan subtotal > 100rb hanya dapat diskon 10%, bukan 15%", () => {
  // Subtotal 150.000, member = true
  // Seharusnya: 10% x 150.000 = 15.000
  // Bug lama: 5% x 150.000 + 10% x 150.000 = 7.500 + 15.000 = 22.500
  const diskon = kasir.hitungDiskon(150000, true);
  assert.strictEqual(diskon, 15000);
});

test("non-member dengan subtotal > 100rb dapat diskon 5%", () => {
  // Subtotal 200.000, member = false
  // Seharusnya: 5% x 200.000 = 10.000
  const diskon = kasir.hitungDiskon(200000, false);
  assert.strictEqual(diskon, 10000);
});

test("member dengan subtotal < 100rb tetap dapat diskon 10%", () => {
  // Subtotal 50.000, member = true
  // Seharusnya: 10% x 50.000 = 5.000
  const diskon = kasir.hitungDiskon(50000, true);
  assert.strictEqual(diskon, 5000);
});

test("non-member dengan subtotal < 100rb tidak dapat diskon", () => {
  const diskon = kasir.hitungDiskon(50000, false);
  assert.strictEqual(diskon, 0);
});
