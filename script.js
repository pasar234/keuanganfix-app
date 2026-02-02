let currentEditIndex = null;

// Jalankan fungsi tampilkan data saat pertama kali buka aplikasi
window.onload = function() {
    tampilkanData();
};

// 1. FUNGSI NAVIGASI (Pindah antar Tab)
function openScreen(id) {
    // Sembunyikan semua layar
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    
    // Tampilkan layar yang dipilih
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        // Refresh tabel jika yang dibuka adalah Hutang atau Piutang
        if (id === 'data-hutang' || id === 'data-piutang') {
            tampilkanData();
        }
    }
}

// 2. FUNGSI SIMPAN DATA (Hutang/Piutang)
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
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
    localStorage.setItem('data_keuangan', JSON.stringify(list));
    
    alert("Data Berhasil Tersimpan!");
    this.reset();
    
    // Langsung pindah ke halaman data yang sesuai
    openScreen(dataBaru.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

// 3. FUNGSI TAMPILKAN DATA (Terpisah Tabel Hutang & Piutang)
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
        
        // Buat daftar riwayat cicilan
        const riwayatHtml = item.riwayat ? item.riwayat.map(r => 
            `<div style="font-size:9px; color:gray;">${r.tgl}: ${r.amt.toLocaleString()}</div>`
        ).join('') : '';
        
        // Warnai merah jika sudah jatuh tempo
        let styleJT = (item.jatuh_tempo !== '-' && new Date(item.jatuh_tempo) <= hariIni && sisa > 0) ? "color:red; font-weight:bold;" : "";

        const baris = `
            <tr>
                <td>${item.tanggal}</td>
                <td style="${styleJT}">${item.jatuh_tempo}</td>
                <td style="font-size:11px;">${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button>
                    ${riwayatHtml}
                    <span class="sisa-teks">Sisa: ${sisa.toLocaleString()}</span>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:3px;">X</button></td>
            </tr>`;

        // Filter masuk ke tabel mana
        if (item.jenis === 'hutang') {
            if (tbodyH) { tbodyH.innerHTML += baris
