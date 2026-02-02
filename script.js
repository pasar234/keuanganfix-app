function tampilkanData() {
    // Ambil data dari penyimpanan lokal
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    
    // Pastikan ID body tabel sesuai dengan yang ada di HTML
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    // Bersihkan tabel sebelum diisi ulang agar tidak dobel
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0;
    let totalP = 0;

    list.forEach((item, index) => {
        const sisa = item.jumlah - (item.bayar || 0);
        
        // Buat baris tabel
        const baris = `
            <tr>
                <td>${formatTglIndo(item.tanggal)}</td>
                <td>${formatTglIndo(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">Bayar</button>
                    <div style="color:blue; font-size:10px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
            </tr>`;

        // Masukkan ke tabel yang sesuai (Hutang atau Piutang)
        if (item.jenis === 'hutang') {
            if (tbodyH) { tbodyH.innerHTML += baris; totalH += sisa; }
        } else if (item.jenis === 'piutang') {
            if (tbodyP) { tbodyP.innerHTML += baris; totalP += sisa; }
        }
    });

    // Update tampilan total saldo di atas tabel
    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
}
