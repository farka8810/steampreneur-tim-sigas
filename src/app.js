/**
 * SIGAS Web Sentinel — Logika Bisnis, Validasi Form, & Pengolahan Data
 * STEAMPreneur SMK 2026 — Tim SIGAS (SMK Telkom Purwokerto)
 */

// Konstanta Investasi & Acuan Standar SIGAS
const BIAYA_SIGAS = 850000; // Rp850.000 per unit purwarupa
const STORAGE_KEY = 'sigas_sentinel_records';

// -------------------------------------------------------------
// 1. FUNGSI LOGIKA ATURAN BISNIS & FORMULA STEAM (Bisa Diuji)
// -------------------------------------------------------------

/**
 * Validasi input formulir pendaftaran & simulasi kios
 */
function validasiInputKios(nama, aset, jamTutup, ppm) {
    const errors = {};

    if (!nama || typeof nama !== 'string' || nama.trim().length === 0) {
        errors.nama = 'Nama kios tidak boleh kosong.';
    } else if (nama.trim().length < 3) {
        errors.nama = 'Nama kios minimal 3 karakter.';
    }

    const numAset = Number(aset);
    if (aset === '' || isNaN(numAset) || numAset <= 0) {
        errors.aset = 'Nilai aset harus berupa angka lebih dari Rp0.';
    }

    if (!jamTutup || typeof jamTutup !== 'string' || !jamTutup.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
        errors.jam = 'Jam tutup harus dalam format jam yang valid (HH:MM).';
    }

    const numPpm = Number(ppm);
    if (ppm === '' || isNaN(numPpm)) {
        errors.ppm = 'Bacaan gas (PPM) harus diisi dengan angka.';
    } else if (numPpm < 0) {
        errors.ppm = 'Nilai PPM tidak boleh negatif.';
    } else if (numPpm > 10000) {
        errors.ppm = 'Nilai PPM melebihi batas ukur sensor (maks 10.000 PPM).';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Evaluasi status bahaya gas dan keputusan katup regulator (Tri-State Logic)
 */
function evaluasiStatusGas(ppm, isClosed = false) {
    const numPpm = Number(ppm);
    let statusBahaya = 'NORMAL';
    let statusKatup = 'TERBUKA';
    let tindakan = 'Siaga Normal (Kompor aman digunakan)';
    let badgeClass = 'badge-normal';

    if (numPpm < 400) {
        statusBahaya = 'NORMAL';
        badgeClass = 'badge-normal';
        tindakan = 'Siaga Normal (Kompor aman digunakan)';
    } else if (numPpm >= 400 && numPpm < 1000) {
        statusBahaya = 'WASPADA';
        badgeClass = 'badge-waspada';
        tindakan = 'Peringatan Rembesan Mikro (Periksa sambungan selang)';
    } else {
        statusBahaya = 'DARURAT';
        badgeClass = 'badge-darurat';
        tindakan = 'BAHAYA BOCOR! Servo Otomatis Memutus Katup Gas';
    }

    // Aturan penutupan katup: Ditutup jika kondisi DARURAT atau Kios Tutup
    if (statusBahaya === 'DARURAT' || isClosed) {
        statusKatup = 'TERTUTUP';
        if (isClosed && statusBahaya !== 'DARURAT') {
            tindakan = 'Kios Tutup: Katup Terkunci Aman via Jadwal RTC';
        }
    } else {
        statusKatup = 'TERBUKA';
    }

    return {
        ppm: numPpm,
        statusBahaya,
        statusKatup,
        tindakan,
        badgeClass
    };
}

/**
 * Menghitung rasio proteksi aset finansial (%)
 */
function hitungRasioProteksi(nilaiAset) {
    const aset = Number(nilaiAset);
    if (!aset || isNaN(aset) || aset <= 0) return 0;
    const rasio = (BIAYA_SIGAS / aset) * 100;
    return Number(rasio.toFixed(1));
}

/**
 * Menyaring data kios berdasarkan kata kunci pencarian (nama atau kategori) dan status bahaya.
 * Memenuhi Kriteria Penerimaan Change Request 1 & 2:
 * 1. Pencarian teks bersifat case-insensitive.
 * 2. Filter status dapat dikombinasikan dengan pencarian secara simultan.
 */
function filterDataKios(kiosList, querySearch = '', filterStatus = 'SEMUA') {
    if (!Array.isArray(kiosList)) return [];
    const q = (querySearch || '').trim().toLowerCase();
    const status = (filterStatus || 'SEMUA').toUpperCase();

    return kiosList.filter(item => {
        const nama = (item.nama || '').toLowerCase();
        const kategori = (item.kategori || '').toLowerCase();
        const matchQuery = !q || nama.includes(q) || kategori.includes(q);
        const matchStatus = (status === 'SEMUA') || (item.statusBahaya === status);
        return matchQuery && matchStatus;
    });
}

/**
 * Mengunduh data kios yang sedang tampil ke dalam format file CSV.
 * Memenuhi Kriteria Penerimaan Change Request 4 & 5:
 * 1. Baris pertama berisi nama kolom (header).
 * 2. Nilai numerik diekspor murni tanpa format mata uang atau pemisah ribuan (contoh: 12500000).
 */
function unduhDataCsv(dataList) {
    if (!Array.isArray(dataList) || dataList.length === 0) {
        alert('Tidak ada data yang dapat diunduh.');
        return;
    }
    const headers = [
        'ID_Kios',
        'Nama_Kios',
        'Kategori',
        'Nilai_Aset',
        'Jam_Tutup',
        'Bacaan_PPM',
        'Status_Bahaya',
        'Kondisi_Katup',
        'Rasio_Proteksi_Persen',
        'Tanggal_Pemeriksaan'
    ];

    const rows = dataList.map(item => [
        item.id,
        `"${(item.nama || '').replace(/"/g, '""')}"`,
        `"${item.kategori || ''}"`,
        Number(item.nilaiAset) || 0,
        item.jamTutup || '',
        Number(item.ppm) || 0,
        item.statusBahaya || '',
        item.statusKatup || '',
        Number(item.rasioProteksi) || 0,
        `"${item.createdAt || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap_sigas_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// 2. MANIPULASI DOM & EVENT LISTENER (Di Lingkungan Browser)
// -------------------------------------------------------------

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let records = loadRecords();

        // Elemen Form
        const form = document.getElementById('kios-form');
        const inputNama = document.getElementById('input-nama-kios');
        const inputKategori = document.getElementById('input-kategori');
        const inputAset = document.getElementById('input-nilai-aset');
        const inputJam = document.getElementById('input-jam-tutup');
        const inputPpm = document.getElementById('input-ppm-gas');
        const inputClosed = document.getElementById('input-is-closed');

        // Elemen Error Alerts
        const errorAlert = document.getElementById('error-alert');
        const errorMessage = document.getElementById('error-message');
        const successAlert = document.getElementById('success-alert');
        const successMessage = document.getElementById('success-message');
        const errNama = document.getElementById('err-nama');
        const errAset = document.getElementById('err-aset');
        const errJam = document.getElementById('err-jam');
        const errPpm = document.getElementById('err-ppm');

        // Elemen Live Preview
        const evalStatusBadge = document.getElementById('eval-status-badge');
        const gaugeFill = document.getElementById('gauge-fill');
        const evalPpm = document.getElementById('eval-ppm');
        const evalValve = document.getElementById('eval-valve');
        const evalAction = document.getElementById('eval-action');
        const evalRasio = document.getElementById('eval-rasio');
        const evalFormula = document.getElementById('eval-formula-text');

        // Elemen Tombol & Toolbar (Change Request)
        const btnSeedData = document.getElementById('btn-seed-data');
        const btnClearAll = document.getElementById('btn-clear-all');
        const searchInput = document.getElementById('search-input');
        const filterStatus = document.getElementById('filter-status');
        const btnExportCsv = document.getElementById('btn-export-csv');

        // Event Listener Toolbar: Pencarian Real-time & Filter Status
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                renderTable();
            });
        }

        if (filterStatus) {
            filterStatus.addEventListener('change', () => {
                renderTable();
            });
        }

        // Event Listener Toolbar: Unduh CSV
        if (btnExportCsv) {
            btnExportCsv.addEventListener('click', () => {
                const query = searchInput ? searchInput.value : '';
                const status = filterStatus ? filterStatus.value : 'SEMUA';
                const currentData = filterDataKios(records, query, status);
                unduhDataCsv(currentData);
            });
        }

        // Update live preview saat input PPM atau Nilai Aset berubah
        function updateLivePreview() {
            const rawPpm = inputPpm.value;
            const rawAset = inputAset.value;
            const isClosed = inputClosed.checked;

            const ppmVal = rawPpm !== '' && !isNaN(Number(rawPpm)) ? Number(rawPpm) : 0;
            const evalResult = evaluasiStatusGas(ppmVal, isClosed);
            const rasio = hitungRasioProteksi(rawAset);

            evalStatusBadge.textContent = evalResult.statusBahaya + (isClosed ? ' (KIOS TUTUP)' : '');
            evalStatusBadge.className = `status-badge ${evalResult.badgeClass}`;

            evalPpm.textContent = `${ppmVal.toLocaleString('id-ID')} PPM`;
            evalValve.textContent = evalResult.statusKatup === 'TERBUKA' ? 'TERBUKA (GAS MENGALIR)' : 'TERTUTUP (CUT-OFF)';
            evalValve.className = `value value-valve ${evalResult.statusKatup === 'TERBUKA' ? 'text-success' : 'text-danger'}`;
            evalAction.textContent = evalResult.tindakan;
            evalRasio.textContent = `${rasio}% dari nilai aset`;

            // Gauge progress bar (Maks 2000 PPM = 100%)
            const gaugePct = Math.min(100, Math.max(5, (ppmVal / 1500) * 100));
            gaugeFill.style.width = `${gaugePct}%`;
            if (evalResult.statusBahaya === 'NORMAL') {
                gaugeFill.style.background = 'var(--color-success)';
            } else if (evalResult.statusBahaya === 'WASPADA') {
                gaugeFill.style.background = 'var(--color-warning)';
            } else {
                gaugeFill.style.background = 'var(--color-danger)';
            }

            if (rawAset && Number(rawAset) > 0) {
                evalFormula.innerHTML = `Biaya SIGAS (Rp850.000) &divide; Rp${Number(rawAset).toLocaleString('id-ID')} = <strong>${rasio}%</strong>`;
            } else {
                evalFormula.innerHTML = `Biaya SIGAS (Rp850.000) &divide; Nilai Aset = Rasio Proteksi (%)`;
            }
        }

        inputPpm.addEventListener('input', updateLivePreview);
        inputAset.addEventListener('input', updateLivePreview);
        inputClosed.addEventListener('change', updateLivePreview);

        // Submit Form Handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            errNama.textContent = '';
            errAset.textContent = '';
            errJam.textContent = '';
            errPpm.textContent = '';
            errorAlert.style.display = 'none';
            successAlert.style.display = 'none';

            const nama = inputNama.value;
            const aset = inputAset.value;
            const jam = inputJam.value;
            const ppm = inputPpm.value;
            const kategori = inputKategori.value;
            const isClosed = inputClosed.checked;

            const validasi = validasiInputKios(nama, aset, jam, ppm);

            if (!validasi.isValid) {
                errorAlert.style.display = 'flex';
                const firstErrMsg = Object.values(validasi.errors)[0];
                errorMessage.textContent = firstErrMsg;

                if (validasi.errors.nama) errNama.textContent = validasi.errors.nama;
                if (validasi.errors.aset) errAset.textContent = validasi.errors.aset;
                if (validasi.errors.jam) errJam.textContent = validasi.errors.jam;
                if (validasi.errors.ppm) errPpm.textContent = validasi.errors.ppm;
                return;
            }

            // Hitung Aturan Bisnis
            const evalResult = evaluasiStatusGas(ppm, isClosed);
            const rasio = hitungRasioProteksi(aset);

            const newKios = {
                id: 'kios-' + Date.now(),
                nama: nama.trim(),
                kategori,
                nilaiAset: Number(aset),
                jamTutup: jam,
                ppm: Number(ppm),
                isClosed,
                statusBahaya: evalResult.statusBahaya,
                statusKatup: evalResult.statusKatup,
                rasioProteksi: rasio,
                tindakan: evalResult.tindakan,
                createdAt: new Date().toLocaleString('id-ID')
            };

            records.unshift(newKios);
            saveRecords(records);
            renderTable();
            renderStats();

            // Tampilkan Alert Sukses
            successAlert.style.display = 'flex';
            successMessage.textContent = `Data "${newKios.nama}" berhasil disimpan dan dievaluasi!`;
            setTimeout(() => { successAlert.style.display = 'none'; }, 4000);

            form.reset();
            inputJam.value = '21:00';
            updateLivePreview();
        });

        // Seed Data Bawaan
        btnSeedData.addEventListener('click', () => {
            records = getSampleData();
            saveRecords(records);
            renderTable();
            renderStats();
            alert('3 Data contoh UMKM kuliner berhasil dimuat!');
        });

        // Clear All Data
        btnClearAll.addEventListener('click', () => {
            if (confirm('Yakin ingin menghapus semua data rekap kios?')) {
                records = [];
                saveRecords(records);
                renderTable();
                renderStats();
            }
        });

        // Render Functions (Change Request: Pencarian, Filter & Tampilan Kosong)
        function renderTable() {
            const tbody = document.getElementById('table-body');
            const emptyState = document.getElementById('empty-state');
            const emptyMessage = document.getElementById('empty-message');

            const query = searchInput ? searchInput.value : '';
            const status = filterStatus ? filterStatus.value : 'SEMUA';

            const filtered = filterDataKios(records, query, status);

            tbody.innerHTML = '';

            if (filtered.length === 0) {
                emptyState.style.display = 'block';
                if (records.length === 0) {
                    emptyMessage.textContent = 'Belum ada data kios. Silakan tambahkan kios baru atau klik "Muat Contoh Data".';
                } else {
                    emptyMessage.textContent = 'Data tidak ditemukan.';
                }
                return;
            } else {
                emptyState.style.display = 'none';
            }

            filtered.forEach((kios, idx) => {
                const tr = document.createElement('tr');

                let badgeClass = 'badge-normal';
                if (kios.statusBahaya === 'WASPADA') badgeClass = 'badge-waspada';
                if (kios.statusBahaya === 'DARURAT') badgeClass = 'badge-darurat';

                const valveClass = kios.statusKatup === 'TERBUKA' ? 'text-success' : 'text-danger';

                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td><strong>${escapeHtml(kios.nama)}</strong></td>
                    <td>${escapeHtml(kios.kategori)}</td>
                    <td>Rp${Number(kios.nilaiAset).toLocaleString('id-ID')}</td>
                    <td>${kios.jamTutup}</td>
                    <td><code>${kios.ppm} PPM</code></td>
                    <td><span class="status-badge ${badgeClass}">${kios.statusBahaya}</span></td>
                    <td><span class="${valveClass}" style="font-weight:700;">${kios.statusKatup}</span></td>
                    <td><span class="text-highlight" style="font-weight:600;">${kios.rasioProteksi}%</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="hapusKios('${kios.id}')" title="Hapus">
                            🗑️
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function renderStats() {
            document.getElementById('stat-total-kios').textContent = records.length;
            const amanCount = records.filter(r => r.statusBahaya === 'NORMAL').length;
            const waspadaCount = records.filter(r => r.statusBahaya === 'WASPADA').length;
            const daruratCount = records.filter(r => r.statusBahaya === 'DARURAT' || r.statusKatup === 'TERTUTUP').length;
            const totalAset = records.reduce((acc, curr) => acc + (Number(curr.nilaiAset) || 0), 0);

            document.getElementById('stat-aman').textContent = amanCount;
            document.getElementById('stat-waspada').textContent = waspadaCount;
            document.getElementById('stat-darurat').textContent = daruratCount;
            document.getElementById('stat-total-aset').textContent = 'Rp' + totalAset.toLocaleString('id-ID');
        }

        // Global Delete
        window.hapusKios = function (id) {
            records = records.filter(r => r.id !== id);
            saveRecords(records);
            renderTable();
            renderStats();
        };

        // Inisialisasi awal
        if (records.length === 0) {
            records = getSampleData();
            saveRecords(records);
        }
        renderTable();
        renderStats();
        updateLivePreview();
    });
}

// -------------------------------------------------------------
// 3. FUNGSI PEMBANTU (LOCALSTORAGE & CSV EXPORTER)
// -------------------------------------------------------------

function loadRecords() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveRecords(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Gagal menyimpan ke LocalStorage', e);
    }
}

function getSampleData() {
    return [
        {
            id: 'kios-01',
            nama: 'Warung Rames Mbak Sri',
            kategori: 'Warung Rames',
            nilaiAset: 12500000,
            jamTutup: '21:00',
            ppm: 250,
            isClosed: false,
            statusBahaya: 'NORMAL',
            statusKatup: 'TERBUKA',
            rasioProteksi: 6.8,
            tindakan: 'Siaga Normal (Kompor aman digunakan)',
            createdAt: '13/10/2026, 09:15'
        },
        {
            id: 'kios-02',
            nama: 'Ayam Goreng Mas Budi',
            kategori: 'Gorengan / Ayam',
            nilaiAset: 8500000,
            jamTutup: '22:00',
            ppm: 550,
            isClosed: false,
            statusBahaya: 'WASPADA',
            statusKatup: 'TERBUKA',
            rasioProteksi: 10.0,
            tindakan: 'Peringatan Rembesan Mikro (Periksa sambungan selang)',
            createdAt: '13/10/2026, 11:30'
        },
        {
            id: 'kios-03',
            nama: 'Kios Mie & Bakso Barokah',
            kategori: 'Mie & Bakso',
            nilaiAset: 18000000,
            jamTutup: '20:00',
            ppm: 1450,
            isClosed: true,
            statusBahaya: 'DARURAT',
            statusKatup: 'TERTUTUP',
            rasioProteksi: 4.7,
            tindakan: 'BAHAYA BOCOR! Servo Otomatis Memutus Katup Gas',
            createdAt: '13/10/2026, 14:00'
        }
    ];
}

function escapeHtml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Ekspor untuk Unit Testing Node.js (Versi 1.0 Alur Inti - Checkpoint 2)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BIAYA_SIGAS,
        validasiInputKios,
        evaluasiStatusGas,
        hitungRasioProteksi,
        filterDataKios,
        getSampleData
    };
}
