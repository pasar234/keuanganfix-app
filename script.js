// Navigasi Utama
function openScreen(id) {
    // 1. Sembunyikan semua screen
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');

    // 2. PAKSA tutup modal pembayaran agar area klik navigasi bersih
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.pointerEvents = 'none'; // Tambahan keamanan
    }

    // 3. Tampilkan screen tujuan
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id.includes('data')) tampilkanData();
    }
}

// Proses Simpan Data
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
    
    // Kembali ke layar tabel secara otomatis setelah simpan
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

// Fungsi penutup modal yang benar
function tutupModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.pointerEvents = 'none';
    }
}

// Fungsi pembuka modal
function inputBayar(index) {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'flex';
    modal.style.pointerEvents = 'auto'; // Aktifkan klik kembali
    // ... isi data input ...
}
