let currentEditIndex = null;

window.onload = function() {
    tampilkanData();
};

function formatTglIndo(tgl) {
    if (!tgl || tgl === '-') return '-';
    const d = tgl.split('-');
    return `${d[2]}-${d[1]}-${d[0]}`; // Merubah ke Hari-Bulan-Tahun
}

function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id.includes('data')) tampilkanData();
    }
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
    alert("Berhasil!");
    this.reset();
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;
    const hariIni = new Date().setHours(0,0,0,0);

    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        const riwayatHtml = item.riwayat ? item.riwayat.map(r => 
            `<div style="font-size:9px; color:gray;">${r.tgl}: ${r.amt.toLocaleString()}</div>`
        ).join('') : '';
        
        let styleJT = (item.jatuh_tempo !== '-' && new Date(item.jatuh_tempo) <= hariIni && sisa > 0) ? "color:red; font-weight:bold;" : "";

        // Pastikan baris menggunakan backtick (`) agar tidak bocor kodenya
        const baris = `
            <tr>
                <td>${formatTglIndo(item.tanggal)}</td>
                <td style="${styleJT}">${formatTglIndo(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">Bayar</button>
                    ${riwayatHtml}
                    <div style="color:blue; font-weight:bold; font-size:10px;">Sisa: ${sisa.toLocaleString()}</div>
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
    document.getElementById('paymentModal').style.display = 'none';
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
    if(confirm("Hapus?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(i, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}
