// Fungsi Pindah Layar
function openScreen(id) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');

    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id === 'data-hutang' || id === 'data-piutang') {
            tampilkanData();
        }
    }
}

// Format Tanggal Indonesia
function formatTgl(tgl) {
    if (!tgl || tgl === '-') return '-';
    const parts = tgl.split('-');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : tgl;
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
    
    alert("Data Berhasil Disimpan!");
    this.reset();
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

// Menampilkan Data ke Tabel (Memperbaiki Tombol Bayar yang Hilang)
function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;

    list.forEach((item, index) => {
        const sisa = item.jumlah - (item.bayar || 0);
        const barisHtml = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td>${formatTgl(item.jatuh_tempo)}</td>
                <td style="font-size:11px;">${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString('id-ID')}</td>
                <td style="text-align:center;">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:4px 8px; border-radius:3px; margin-bottom:4px;">Bayar</button>
                    <div style="color:blue; font-size:10px; font-weight:bold;">Sisa: ${sisa.toLocaleString('id-ID')}</div>
                </td>
                <td>
                    <button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:6px; border-radius:3px;">X</button>
                </td>
            </tr>`;

        if (item.jenis === 'hutang' && tbodyH) {
            tbodyH.innerHTML += barisHtml;
            totalH += sisa;
        } else if (item.jenis === 'piutang' && tbodyP) {
            tbodyP.innerHTML += barisHtml;
            totalP += sisa;
        }
    });

    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString('id-ID');
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString('id-ID');
}

// Fungsi Input Pembayaran
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    const sisaSekarang = list[index].jumlah - (list[index].bayar || 0);
    
    let nominal = prompt(`Masukkan nilai pembayaran (Sisa: ${sisaSekarang.toLocaleString()}):`, sisaSekarang);
    
    if (nominal !== null && nominal !== "") {
        list[index].bayar = (list[index].bayar || 0) + parseFloat(nominal);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

// Hapus Data
function hapusData(i) {
    if(confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(i, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

// Ekspor & Impor (Backup)
function eksporData() {
    const data = localStorage.getItem('data_keuangan');
    if(!data || data === "[]") return alert("Tidak ada data untuk dibackup.");
    const blob = new Blob([data], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `backup_keuangan_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

function imporData() {
    const txt = document.getElementById('importDataText').value;
    try {
        const parsed = JSON.parse(txt);
        localStorage.setItem('data_keuangan', JSON.stringify(parsed));
        alert("Data Berhasil Dipulihkan!");
        location.reload();
    } catch(e) { 
        alert("Gagal! Pastikan format kode JSON benar."); 
    }
                             }
