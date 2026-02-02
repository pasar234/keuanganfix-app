// Pastikan fungsi ini dipanggil saat halaman dimuat pertama kali
window.onload = function() {
    tampilkanData();
};

// 1. FUNGSI SIMPAN (Penyebab data tidak tersimpan sebelumnya)
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ambil nilai dari input
    const dataBaru = {
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
    list.push(dataBaru);
    localStorage.setItem('data_keuangan', JSON.stringify(list)); // Simpan ke memori HP/Tablet
    
    alert("Data Berhasil Tersimpan!");
    this.reset();
    
    // Pindah ke layar yang sesuai otomatis
    openScreen(dataBaru.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

// 2. FUNGSI TAMPILKAN (Agar angka Rp tidak nol)
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

        const baris = `
            <tr>
                <td>${item.tanggal}</td>
                <td style="${styleJT}">${item.jatuh_tempo}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button>
                    ${riwayatHtml}
                    <div style="color:blue; font-weight:bold; font-size:10px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none;">X</button></td>
            </tr>`;

        if (item.jenis === 'hutang') {
            if (tbodyH) { tbodyH.innerHTML += baris; totalH += sisa; }
        } else {
            if (tbodyP) { tbodyP.innerHTML += baris; totalP += sisa; }
        }
    });

    // Update total angka di layar
    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
}

// 3. FUNGSI NAVIGASI
function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        tampilkanData(); // Refresh data setiap pindah halaman
    }
}
