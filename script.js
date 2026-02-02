let currentEditIndex = null;

// Fungsi Navigasi yang Memaksa Semua Layar Tertutup Benar
function openScreen(id) {
    // Sembunyikan semua screen
    document.querySelectorAll('.screen').forEach(s => {
        s.style.display = 'none';
    });

    // PAKSA TUTUP MODAL (Agar tidak menutupi tombol klik)
    tutupModal();

    // Tampilkan screen yang dipilih
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id.includes('data')) tampilkanData();
    }
}

function formatTglIndo(tgl) {
    if (!tgl || tgl === '-') return '-';
    const [y, m, d] = tgl.split('-');
    return `${d}-${m}-${y}`;
}

document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        id: Date.now(),
        jenis: document.getElementById('jenis').value,
        tanggal: document.getElementById('tanggal').value,
        jatuh_tempo: document.getElementById('jatuh_tempo').value || '-',
        jumlah: parseFloat(document.getElementById('jumlah').value),
        bayar: 0,
        keterangan: document.getElementById('keterangan').value,
        riwayat: []
    };
    
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    list.push(data);
    localStorage.setItem('data_keuangan', JSON.stringify(list));
    
    alert("Data Tersimpan!");
    this.reset();
    
    // Langsung pindah layar setelah simpan
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;

    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        // Gunakan Template String (Backtick) untuk menghindari "Bocor Kode"
        const baris = `
            <tr>
                <td>${formatTglIndo(item.tanggal)}</td>
                <td>${formatTglIndo(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">Bayar</button>
                    <div style="color:blue; font-size:10px; font-weight:bold;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:5px;">X</button></td>
            </tr>`;

        if (item.jenis === 'hutang') {
            if (tbodyH) { tbodyH.innerHTML += baris; totalH += sisa; }
        } else {
            if (tbodyP) { tbodyP.innerHTML += baris; totalP += sisa; }
        }
    });

    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
}

function inputBayar(index) {
    currentEditIndex = index;
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    document.getElementById('nominalInput').value = list[index].jumlah - list[index].bayar;
    document.getElementById('tglBayarInput').valueAsDate = new Date();
    document.getElementById('paymentModal').style.display = 'flex';
}

function tutupModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';
}

function prosesBayar() {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    let nominal = parseFloat(document.getElementById('nominalInput').value);
    let tgl = document.getElementById('tglBayarInput').value;
    if (nominal && tgl) {
        list[currentEditIndex].riwayat.push({ tgl: formatTglIndo(tgl), amt: nominal });
        list[currentEditIndex].bayar += nominal;
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tutupModal();
        tampilkanData();
    }
}

function hapusData(i) {
    if(confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(i, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function eksporData() {
    const data = localStorage.getItem('data_keuangan');
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "backup_keuangan.json";
    a.click();
}

function imporData() {
    const txt = document.getElementById('importDataText').value;
    try {
        const p = JSON.parse(txt);
        localStorage.setItem('data_keuangan', JSON.stringify(p));
        alert("Berhasil!");
        location.reload();
    } catch(e) { alert("Format Salah!"); }
}
