function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyHutang = document.getElementById('tbody-hutang');
    const tbodyPiutang = document.getElementById('tbody-piutang');
    
    // Reset isi tabel sebelum diisi ulang
    if (tbodyHutang) tbodyHutang.innerHTML = '';
    if (tbodyPiutang) tbodyPiutang.innerHTML = '';
    
    let totalH = 0;
    let totalP = 0;
    const hariIni = new Date().setHours(0,0,0,0);

    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        
        // Cek Riwayat Tanggal Pembayaran
        const riwayatList = item.riwayat ? item.riwayat.map(r => 
            `<div style="font-size:10px; color:gray;">${r.tgl}: ${r.amt.toLocaleString()}</div>`
        ).join('') : '';

        // Tanda Merah jika Jatuh Tempo sudah lewat
        let styleJT = "";
        if (item.jatuh_tempo !== '-' && new Date(item.jatuh_tempo) <= hariIni && sisa > 0) {
            styleJT = "color:red; font-weight:bold;";
        }

        const barisHtml = `
            <tr>
                <td>${item.tanggal}</td>
                <td style="${styleJT}">${item.jatuh_tempo}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button>
                    ${riwayatList}
                    <span class="sisa-saldo">Sisa: ${sisa.toLocaleString()}</span>
                </td>
                <td><button class="btn-aksi-hapus" onclick="hapusData(${index})">X</button></td>
            </tr>`;

        // Filter Data berdasarkan Jenis
        if (item.jenis === 'hutang') {
            if (tbodyHutang) tbodyHutang.innerHTML += barisHtml;
            totalH += sisa;
        } else {
            if (tbodyPiutang) tbodyPiutang.innerHTML += barisHtml;
            totalP += sisa;
        }
    });

    // Update Ringkasan Saldo di bagian atas halaman masing-masing
    const elTotalH = document.getElementById('totalHutang');
    const elTotalP = document.getElementById('totalPiutang');
    if (elTotalH) elTotalH.innerText = totalH.toLocaleString();
    if (elTotalP) elTotalP.innerText = totalP.toLocaleString();
}
