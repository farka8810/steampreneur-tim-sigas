/**
 * Unit Test Otomatis untuk Aturan Bisnis & Logika SIGAS Web Sentinel
 * Framework: Node.js Native Test Runner (node --test)
 */

const test = require('node:test');
const assert = require('node:assert');
const {
    validasiInputKios,
    evaluasiStatusGas,
    hitungRasioProteksi,
    filterDataKios,
    getSampleData
} = require('../src/app.js');

test('1. Validasi Input: Menolak nama kosong, aset <= 0, dan PPM negatif', () => {
    // Kasus 1: Nama kosong
    const res1 = validasiInputKios('', 12500000, '21:00', 300);
    assert.strictEqual(res1.isValid, false);
    assert.ok(res1.errors.nama);

    // Kasus 2: Aset nol / negatif
    const res2 = validasiInputKios('Warung A', 0, '21:00', 300);
    assert.strictEqual(res2.isValid, false);
    assert.ok(res2.errors.aset);

    // Kasus 3: PPM negatif
    const res3 = validasiInputKios('Warung B', 10000000, '21:00', -50);
    assert.strictEqual(res3.isValid, false);
    assert.ok(res3.errors.ppm);

    // Kasus 4: Input valid
    const res4 = validasiInputKios('Warung Rames Mbak Sri', 12500000, '21:00', 250);
    assert.strictEqual(res4.isValid, true);
    assert.strictEqual(Object.keys(res4.errors).length, 0);
});

test('2. Logika Status: Menghasilkan status NORMAL jika PPM < 400', () => {
    const res = evaluasiStatusGas(350, false);
    assert.strictEqual(res.statusBahaya, 'NORMAL');
    assert.strictEqual(res.statusKatup, 'TERBUKA');
});

test('3. Batas Ambang: Menghasilkan status WASPADA jika PPM tepat 400', () => {
    const res = evaluasiStatusGas(400, false);
    assert.strictEqual(res.statusBahaya, 'WASPADA');
    assert.strictEqual(res.statusKatup, 'TERBUKA');
});

test('4. Batas Ambang: Menghasilkan status DARURAT dan memutus katup jika PPM >= 1000', () => {
    const res = evaluasiStatusGas(1000, false);
    assert.strictEqual(res.statusBahaya, 'DARURAT');
    assert.strictEqual(res.statusKatup, 'TERTUTUP');
});

test('5. Numerasi Finansial: Menghitung Rasio Proteksi Aset secara presisi', () => {
    // Nilai aset Rp12.500.000 dengan biaya SIGAS Rp850.000 -> 850.000 / 12.500.000 * 100 = 6.8%
    const rasio1 = hitungRasioProteksi(12500000);
    assert.strictEqual(rasio1, 6.8);

    // Nilai aset Rp8.500.000 -> 850.000 / 8.500.000 * 100 = 10.0%
    const rasio2 = hitungRasioProteksi(8500000);
    assert.strictEqual(rasio2, 10.0);
});

test('6. Change Request: Pencarian case-insensitive, filter status, dan penanganan data kosong', () => {
    const dummyData = getSampleData(); // 3 kios bawaan

    // CR-01: Pencarian case-insensitive (huruf kecil 'rames' mencocokkan 'Warung Rames Mbak Sri')
    const resSearch = filterDataKios(dummyData, 'rames', 'SEMUA');
    assert.strictEqual(resSearch.length, 1);
    assert.strictEqual(resSearch[0].nama, 'Warung Rames Mbak Sri');

    // CR-02: Filter status bahaya DARURAT
    const resStatus = filterDataKios(dummyData, '', 'DARURAT');
    assert.strictEqual(resStatus.length, 1);
    assert.strictEqual(resStatus[0].statusBahaya, 'DARURAT');
    assert.strictEqual(resStatus[0].nama, 'Kios Mie & Bakso Barokah');

    // CR-03: Kombinasi pencarian & filter yang tidak cocok (Empty State: 'Data tidak ditemukan')
    const resEmpty = filterDataKios(dummyData, 'martabak', 'DARURAT');
    assert.strictEqual(resEmpty.length, 0);

    // CR-04: Filter kombinasi pencarian kata dan status
    const resKombinasi = filterDataKios(dummyData, 'bakso', 'DARURAT');
    assert.strictEqual(resKombinasi.length, 1);
    assert.strictEqual(resKombinasi[0].nama, 'Kios Mie & Bakso Barokah');
});

