// Fungsi Navigasi (Memperbaiki tombol yang tidak bisa diklik)
function openScreen(id) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    
    // Tampilkan halaman yang dipilih
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        // Refresh data jika membuka tabel
        if (id === 'data-hutang' || id === 'data-piutang') tampilkanData();
    }
}

// Fungsi Simpan Data Baru
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
    
    alert("Data Berhasil Disimpan!");
    this.reset();
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

// Fungsi Menampilkan Tabel (Merapikan kolom dan sisa saldo)
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
        
        // Cek Jatuh Tempo
        let classJT = (item.jatuh_tempo !== '-' && new Date(item.jatuh_tempo) <= hariIni && sisa > 0) ? "jatuh-tempo-lewat" : "";

        const barisHtml = `
            <tr>
                <td>${item.tanggal}</td>
                <td class="${classJT}">${item.jatuh_tempo}</td>
                <td style="max-width:150px;">${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button>
                    ${riwayatHtml}
                    <span class="sisa-saldo">Sisa: ${sisa.toLocaleString()}</span>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:5px;">X</button></td>
            </tr>`;

        if (item.jenis === 'hutang') {
            if (tbodyH) { tbodyH.innerHTML += barisHtml; totalH += sisa; }
        } else {
            if (tbodyP) { tbodyP.innerHTML += barisHtml; totalP += barisHtml; totalP += sisa; }
        }
    });

    // Update total saldo per halaman
    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
        }
