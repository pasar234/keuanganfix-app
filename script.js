// Perbaikan Navigasi
function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    tutupModal(); // Tutup modal bayar jika pindah layar agar tidak bocor
    
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id.includes('data')) tampilkanData();
    }
}

// Format Tanggal Indo
function formatTgl(tgl) {
    if (!tgl || tgl === '-') return '-';
    const [y, m, d] = tgl.split('-');
    return `${d}-${m}-${y}`;
}

function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        const baris = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td>${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">Bayar</button>
                    <div style="color:blue; font-size:10px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
            </tr>`;

        if (item.jenis === 'hutang' && tbodyH) tbodyH.innerHTML += baris;
        if (item.jenis === 'piutang' && tbodyP) tbodyP.innerHTML += baris;
    });
}

// Sisanya adalah fungsi simpanData, inputBayar, dan hapusData seperti sebelumnya.
