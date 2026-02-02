function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;

    list.forEach((item, index) => {
        const sisa = item.jumlah - (item.bayar || 0);
        
        // Kode HTML untuk baris tabel
        const baris = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td>${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td style="text-align:center;">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer; margin-bottom:5px;">Bayar</button>
                    <div style="color:blue; font-size:11px; font-weight:bold;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td>
                    <button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:8px; border-radius:3px; cursor:pointer;">X</button>
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

    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
}

// Tambahkan fungsi inputBayar ini agar tombol berfungsi
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    let nominal = prompt("Masukkan Nominal Pembayaran:", list[index].jumlah - list[index].bayar);
    
    if (nominal !== null && nominal !== "") {
        list[index].bayar = (list[index].bayar || 0) + parseFloat(nominal);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData(); // Refresh tabel
        alert("Pembayaran Berhasil Dicatat!");
    }
}
