function tampilkanData() {
    // 1. Ambil data dan pastikan formatnya array
    const rawData = localStorage.getItem('data_keuangan');
    let list = [];
    try {
        list = JSON.parse(rawData) || [];
    } catch (e) {
        console.error("Gagal membaca data:", e);
        list = [];
    }

    // 2. Hubungkan ke elemen tabel di HTML
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    // Bersihkan isi tabel lama
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0;
    let totalP = 0;

    // 3. Masukkan data satu per satu ke tabel
    list.forEach((item, index) => {
        const sisa = (item.jumlah || 0) - (item.bayar || 0);
        
        // Buat baris tabel baru
        const baris = document.createElement('tr');
        baris.innerHTML = `
            <td>${formatTglIndo(item.tanggal)}</td>
            <td>${formatTglIndo(item.jatuh_tempo)}</td>
            <td style="font-size:11px;">${item.keterangan || '-'}</td>
            <td>${Number(item.jumlah).toLocaleString('id-ID')}</td>
            <td>
                <button onclick="inputBayar(${index})" style="padding:2px 5px;">Bayar</button>
                <div style="color:blue; font-size:10px; font-weight:bold;">Sisa: ${sisa.toLocaleString('id-ID')}</div>
            </td>
            <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:5px; border-radius:3px;">X</button></td>
        `;

        // Masukkan ke tabel yang benar (Hutang atau Piutang)
        if (item.jenis === 'hutang' && tbodyH) {
            tbodyH.appendChild(baris);
            totalH += sisa;
        } else if (item.jenis === 'piutang' && tbodyP) {
            tbodyP.appendChild(baris);
            totalP += sisa;
        }
    });

    // 4. Update ringkasan total di atas tabel
    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString('id-ID');
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString('id-ID');
}
