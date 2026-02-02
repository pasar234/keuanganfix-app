// Fungsi pembantu untuk mengubah format tanggal ke Indo (DD-MM-YYYY)
function formatTglIndo(tgl) {
    if (!tgl || tgl === '-') return '-';
    const d = tgl.split('-');
    return `${d[2]}-${d[1]}-${d[0]}`;
}

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

        // Menggunakan formatTglIndo agar tampilan tanggal rapi
        const baris = `
            <tr>
                <td>${formatTglIndo(item.tanggal)}</td>
                <td style="${styleJT}">${formatTglIndo(item.jatuh_tempo)}</td>
                <td style="font-size:11px;">${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})" style="cursor:pointer; padding:4px 8px;">Bayar</button>
                    ${riwayatHtml}
                    <div style="color:blue; font-weight:bold; font-size:10px; margin-top:2px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:5px; border-radius:3px;">X</button></td>
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

// Pastikan fungsi inputBayar didefinisikan dengan benar agar tombol bisa diklik
function inputBayar(index) {
    currentEditIndex = index;
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    
    document.getElementById('nominalInput').value = list[index].jumlah - list[index].bayar;
    document.getElementById('tglBayarInput').valueAsDate = new Date();
    document.getElementById('metodeInput').value = "Tunai";
    
    document.getElementById('paymentModal').style.display = 'flex';
}
