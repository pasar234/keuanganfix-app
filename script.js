function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id === 'data-hutang' || id === 'data-piutang') tampilkanData();
    }
}

function formatTgl(tgl) {
    if (!tgl || tgl === '-') return '-';
    const d = tgl.split('-');
    return d.length === 3 ? `${d[2]}-${d[1]}-${d[0]}` : tgl;
}

document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        jenis: document.getElementById('jenis').value,
        tanggal: document.getElementById('tanggal').value,
        jatuh_tempo: document.getElementById('jatuh_tempo').value || '-',
        jumlah: parseFloat(document.getElementById('jumlah').value),
        bayar: 0,
        metode: '',
        keterangan: document.getElementById('keterangan').value
    };
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    list.push(data);
    localStorage.setItem('data_keuangan', JSON.stringify(list));
    alert("Tersimpan!");
    this.reset();
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

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
        let styleTempo = "";
        
        // Cek Jatuh Tempo
        if (item.jatuh_tempo !== "-" && sisa > 0) {
            if (new Date(item.jatuh_tempo).getTime() < hariIni) styleTempo = "color:red; font-weight:bold;";
        }

        const baris = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${styleTempo}">${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan} ${item.metode ? `<br><i>(${item.metode})</i>` : ''}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td align="center">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:4px;">Bayar</button>
                    <div style="font-size:10px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
            </tr>`;

        if (item.jenis === 'hutang') { tbodyH.innerHTML += baris; totalH += sisa; }
        else { tbodyP.innerHTML += baris; totalP += sisa; }
    });
    document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
}

function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    let nominal = prompt("Jumlah Bayar:", list[index].jumlah - list[index].bayar);
    if (nominal) {
        let met = prompt("Metode (Tunai/Transfer):", "Tunai");
        list[index].bayar += parseFloat(nominal);
        list[index].metode = met;
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function hapusData(i) {
    if(confirm("Hapus?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(i, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function eksporData() {
    const blob = new Blob([localStorage.getItem('data_keuangan')], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "backup.json";
    a.click();
}

function imporData() {
    try {
        const txt = document.getElementById('importDataText').value;
        localStorage.setItem('data_keuangan', JSON.stringify(JSON.parse(txt)));
        alert("Sukses!");
        location.reload();
    } catch(e) { alert("Format Salah!"); }
            }
