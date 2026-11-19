(() => {
  'use strict';
  const form = document.getElementById('sponsor-form');
  const review = document.getElementById('sponsor-review');
  const summary = document.getElementById('sponsor-summary');
  const status = document.getElementById('sponsor-status');
  const placement = form.elements.namedItem('placement');
  const data = () => Object.fromEntries([...new FormData(form)].map(([key,value]) => [key,String(value).trim()]));
  const positions = {
    Platinum:['Dibahas bersama','Main Sponsor 1 — depan atas','Main Sponsor 2 — depan tengah','Main Sponsor 3 — depan bawah'],
    Gold:['Dibahas bersama','Lengan kanan','Lengan kiri','Punggung atas','Punggung bawah']
  };
  function updatePositions() {
    const selected = data().package;
    const previous = placement.value;
    placement.replaceChildren(...(positions[selected] || ['Dibahas bersama']).map(value => new Option(value,value)));
    if ([...placement.options].some(option => option.value === previous)) placement.value = previous;
  }
  function syncPrint() {
    const values = data();
    document.querySelectorAll('[data-sponsor-print]').forEach(node => {
      const key = node.dataset.sponsorPrint;
      node.textContent = key === 'placement' && !values.package ? '' : values[key] || '';
    });
    document.querySelectorAll('[data-sponsor-check]').forEach(node => node.classList.toggle('is-checked',node.dataset.sponsorCheck === values.package));
  }
  function invalidateReview() {review.hidden = true;status.textContent = '';document.getElementById('sponsor-whatsapp').removeAttribute('href');}
  form.addEventListener('input', invalidateReview);
  form.addEventListener('change', event => {if (event.target.name === 'package') updatePositions();invalidateReview();});
  document.querySelectorAll('[data-select-package]').forEach(link => link.addEventListener('click', () => {
    const input = [...form.elements.namedItem('package')].find(radio => radio.value === link.dataset.selectPackage);
    if (input) {input.checked = true;updatePositions();invalidateReview();}
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = data();
    for (const key of ['company','contact','details']) {
      const input = form.elements.namedItem(key);
      input.setCustomValidity(values[key] ? '' : 'Mohon isi bagian ini.');
      if (!values[key]) {input.reportValidity();input.addEventListener('input', () => input.setCustomValidity(''),{once:true});return;}
    }
    const lines = [
      'KONFIRMASI KESEDIAAN SPONSORSHIP — PANCASILA FC','',
      'Perusahaan: '+values.company,'PIC perusahaan: '+values.contact,
      ...(values.role?['Jabatan: '+values.role]:[]),'Telepon / WhatsApp: '+values.phone,
      ...(values.email?['Email: '+values.email]:[]),...(values.address?['Alamat: '+values.address]:[]),
      '', 'Pilihan kemitraan: '+values.package,'Bentuk dukungan: '+values.support,
      'Preferensi posisi logo: '+values.placement,'Rincian dukungan: '+values.details,'',
      'Kami bersedia menjadi sponsor jersey Pancasila FC dan dapat dihubungi untuk finalisasi bentuk dukungan serta hak kemitraan.',
      'Posisi logo dan rincian kerja sama mengikuti kesepakatan bersama.'
    ];
    summary.textContent = lines.join('\n');
    document.getElementById('sponsor-whatsapp').href = 'https://wa.me/6287841749082?text='+encodeURIComponent(summary.textContent);
    review.hidden = false;status.textContent = 'Ringkasan siap ditinjau. Pesan belum dikirim.';
    syncPrint();review.focus({preventScroll:true});review.scrollIntoView({behavior:'smooth',block:'center'});
  });
  document.getElementById('copy-sponsor-summary').addEventListener('click', async () => {
    try {await navigator.clipboard.writeText(summary.textContent);status.textContent='Ringkasan berhasil disalin.';}
    catch {const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(summary);selection.removeAllRanges();selection.addRange(range);status.textContent='Teks dipilih. Gunakan Ctrl+C atau menu Salin pada perangkat Anda.';}
  });
  document.getElementById('print-sponsor-form').addEventListener('click', () => {syncPrint();document.body.dataset.printMode='form';window.print();});
  window.addEventListener('beforeprint',syncPrint);
  window.addEventListener('afterprint',() => {delete document.body.dataset.printMode;});
  updatePositions();syncPrint();
})();
