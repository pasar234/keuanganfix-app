// Fungsi Menampilkan Data dengan Indikator Jatuh Tempo Merah
function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;
    const hariIni = new Date().setHours(0,0,0,0);

    list.forEach((item, index) => {
        const sisa = item.jumlah - (item.bayar || 0);
        
        // Logika Warna Merah untuk Jatuh Tempo
        let styleTempo = "";
        if (item.jatuh_tempo !== "-") {
            const tglTempo = new Date(item.jatuh_tempo).getTime();
            if (tglTempo < hariIni && sisa > 0) {
                styleTempo = "color: red; font-weight: bold;";
            }
        }

        const barisHtml = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${styleTempo}">${formatTgl(item.jatuh_tempo)}</td>
                <td style="font-size:11px;">
                    ${item.keterangan}
                    ${item.metode ? `<br><small><i>(${item.metode})</i></small>` : ''}
                </td>
                <td>${item.jumlah.toLocaleString('id-ID')}</td>
                <td style="text-align:center;">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:4px 8px; border-radius:3px; margin-bottom:4px;">Bayar</button>
                    <div style="color:blue; font-size:10px; font-weight:bold;">Sisa: ${sisa.toLocaleString('id-ID')}</div>
                </td>
                <td>
                    <button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:6px; border-radius:3px;">X</button>
                </td>
            </tr>`;

        if (item.jenis === 'hutang' && tbodyH) {
            tbodyH.innerHTML += barisHtml;
            totalH += sisa;
        } else if (item.jenis === 'piutang' && tbodyP) {
            tbodyP.innerHTML += barisHtml;
            totalP += sisa;
        }
    });

    if (document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString('id-ID');
    if (document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString('id-ID');
}

// Fungsi Bayar dengan Keterangan Tunai/Transfer
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    const sisaSekarang = list[index].jumlah - (list[index].bayar || 0);
    
    let nominal = prompt(`Masukkan nilai pembayaran (Sisa: ${sisaSekarang.toLocaleString()}):`, sisaSekarang);
    
    if (nominal !== null && nominal !== "") {
        let metode = prompt("Metode Pembayaran (Tunai/Transfer):", "Tunai"); // Tambahan input metode
        
        list[index].bayar = (list[index].bayar || 0) + parseFloat(nominal);
        list[index].metode = metode; // Simpan metode ke data
        
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
                      }
