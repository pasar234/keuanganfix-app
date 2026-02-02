// Navigasi yang diperbaiki agar ID sesuai
function openScreen(id) {
    // Sembunyikan semua screen
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');

    // Tampilkan layar yang dipilih
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        // Jalankan fungsi tampil data jika membuka layar tabel
        if (id === 'data-hutang' || id === 'data-piutang') {
            tampilkanData();
        }
    }
}

// Format Tanggal Hari-Bulan-Tahun
function formatTgl(tgl) {
    if (!tgl || tgl === '-') return '-';
    const [y, m, d] = tgl.split('-');
    return `${d}-${m}-${y}`;
}

// Simpan Data Baru
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        jenis: document.getElementById('jenis').value,
        tanggal: document.getElementById('tanggal').value,
        jatuh_tempo: document.getElementById('jatuh_tempo').value || '-',
        jumlah: parseFloat(document.getElementById('jumlah').value),
        bayar: 0,
        keterangan: document.getElementById('keterangan').value
    };
    
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    list.push(data);
    localStorage.setItem('data_keuangan', JSON.stringify(list));
    
    alert("Berhasil!");
    this.reset();
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

// Menampilkan Data ke Tabel
function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;

    list.forEach((item, index) => {
        const sisa = item.jumlah - (item.bayar || 0);
        const baris = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td>${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>${sisa.toLocaleString()}</td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
            </tr>`;

        if (item.jenis === 'hutang' && tbodyH) {
            tbodyH.innerHTML += baris;
            totalH += sisa;
        } else if (item.jenis === 'piutang' && tbodyP) {
            tbodyP.innerHTML += baris;
            totalP += sisa;
        }
    });

    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
}

function hapusData(i) {
    if(confirm("Hapus?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(i, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

// Backup & Restore
function eksporData() {
    const data = localStorage.getItem('data_keuangan');
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "backup.json";
    a.click();
}

function imporData() {
    const txt = document.getElementById('importDataText').value;
    try {
        localStorage.setItem('data_keuangan', JSON.stringify(JSON.parse(txt)));
        alert("Berhasil!");
        location.reload();
    } catch(e) { alert("Format Salah!"); }
}
