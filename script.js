// Navigasi Utama
function openScreen(id) {
    // Sembunyikan semua layar
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(s => s.style.display = 'none');

    // Tampilkan layar tujuan
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id === 'data-hutang' || id === 'data-piutang') {
            tampilkanData();
        }
    }
}

// Format Tanggal
function formatTgl(tgl) {
    if (!tgl || tgl === '-') return '-';
    const d = tgl.split('-');
    return d.length === 3 ? `${d[2]}-${d[1]}-${d[0]}` : tgl;
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
        metode: '',
        keterangan: document.getElementById('keterangan').value
    };
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    list.push(data);
    localStorage.setItem('data_keuangan', JSON.stringify(list));
    alert("Data Berhasil Disimpan!");
    this.reset();
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

// Tampilkan Data ke Tabel
function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;
    const hariIni = new Date().setHours(0,0,0,0);

    list.forEach((item, index) => {
        const sisa = item.jumlah - (item.bayar || 0);
        let styleTempo = "";
        
        // Warna merah jika telat tempo
        if (item.jatuh_tempo !== "-" && sisa > 0) {
            const tglTempo = new Date(item.jatuh_tempo).getTime();
            if (tglTempo < hariIni) styleTempo = "color:red; font-weight:bold;";
        }

        const baris = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${styleTempo}">${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan} ${item.metode ? `<br><i>(${item.metode})</i>` : ''}</td>
                <td>${item.jumlah.toLocaleString('id-ID')}</td>
                <td align="center">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:4px 8px; border-radius:3px;">Bayar</button>
                    <div style="font-size:10px; margin-top:3px;">Sisa: ${sisa.toLocaleString('id-ID')}</div>
                </td>
                <td align="center">
                    <button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:4px 8px; border-radius:3px;">X</button>
                </td>
            </tr>`;

        if (item.jenis === 'hutang' && tbodyH) {
            tbodyH.innerHTML += baris;
            totalH += sisa;
        } else if (item.jenis === 'piutang' && tbodyP) {
            tbodyP.innerHTML += baris;
            totalP += sisa;
        }
    });

    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString('id-ID');
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString('id-ID');
}

// Fitur Bayar
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    let sisa = list[index].jumlah - (list[index].bayar || 0);
    
    let nominal = prompt(`Jumlah Bayar (Maks: ${sisa.toLocaleString()}):`, sisa);
    if (nominal) {
        let met = prompt("Metode (Tunai/Transfer):", "Tunai");
        list[index].bayar += parseFloat(nominal);
        list[index].metode = met;
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function hapusData(index) {
    if (confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(index, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function eksporData() {
    const data = localStorage.getItem('data_keuangan');
    const blob = new Blob([data], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "backup_keuangan.json";
    a.click();
}

function imporData() {
    try {
        const txt = document.getElementById('importDataText').value;
        localStorage.setItem('data_keuangan', JSON.stringify(JSON.parse(txt)));
        alert("Data Berhasil Dipulihkan!");
        location.reload();
    } catch(e) { alert("Format Salah!"); }
                                                        }
