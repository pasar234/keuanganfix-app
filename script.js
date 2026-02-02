let currentEditIndex = null;

// 1. FUNGSI NAVIGASI (Sesuai dengan tombol di GitHub kamu)
function openScreen(id) {
    // Sembunyikan semua layar agar tidak bertumpuk
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    
    // Tampilkan layar yang diklik (transaksi, data-hutang, atau data-piutang)
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        // Jika membuka halaman data, jalankan fungsi tampilkan tabel
        if (id === 'data-hutang' || id === 'data-piutang') {
            tampilkanData();
        }
    }
}

// 2. TAMPILKAN DATA (Terbagi otomatis ke tabel Hutang atau Piutang)
function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    // Bersihkan isi tabel lama
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;
    const hariIni = new Date().setHours(0,0,0,0);

    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        
        // Format riwayat pembayaran untuk kolom Bayar/Sisa
        const riwayatHtml = item.riwayat ? item.riwayat.map(r => 
            `<div style="font-size:9px; color:gray;">${r.tgl}: ${r.amt.toLocaleString()}</div>`
        ).join('') : '';
        
        // Tanda merah jika jatuh tempo terlewati
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
                    <div style="color:blue; font-weight:bold; font-size:10px; margin-top:2px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; border-radius:3px;">X</button></td>
            </tr>`;

        // Masukkan data ke tabel yang benar berdasarkan jenisnya
        if (item.jenis === 'hutang') {
            if (tbodyH) tbodyH.innerHTML += baris;
            totalH += sisa;
        } else {
            if (tbodyP) tbodyP.innerHTML += baris;
            totalP += sisa;
        }
    });

    // Update angka total saldo
    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
}

// 3. FUNGSI BAYAR (Tetap menggunakan kalender otomatis)
function inputBayar(index) {
    currentEditIndex = index;
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    
    // Buka Modal (Pastikan ID modal di HTML adalah 'paymentModal')
    document.getElementById('nominalInput').value = list[index].jumlah - list[index].bayar;
    document.getElementById('tglBayarInput').valueAsDate = new Date();
    document.getElementById('metodeInput').value = "Tunai";
    document.getElementById('paymentModal').style.display = 'block';
}

function prosesBayar() {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    let nominal = parseFloat(document.getElementById('nominalInput').value);
    let tgl = document.getElementById('tglBayarInput').value;
    let metode = document.getElementById('metodeInput').value;

    if (nominal && tgl) {
        let d = tgl.split('-');
        let tglFormat = `${d[2]}-${d[1]}-${d[0]}`;
        
        if (!list[currentEditIndex].riwayat) list[currentEditIndex].riwayat = [];
        
        list[currentEditIndex].riwayat.push({ tgl: tglFormat, amt: nominal });
        list[currentEditIndex].bayar += nominal;
        
        // Catat tanggal & metode ke kolom keterangan
        list[currentEditIndex].keterangan += ` [${tglFormat}: ${metode} Rp${nominal.toLocaleString()}]`;
        
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        document.getElementById('paymentModal').style.display = 'none';
        tampilkanData();
    }
}
