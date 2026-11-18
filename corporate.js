(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav');
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Buka menu navigasi');
    navigation.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {if (event.key === 'Escape') closeMenu();});
  const positions = {
    main: ['01 — Tiga slot Main Sponsor', 'Bagian depan jersey menyediakan hingga tiga slot sponsor utama untuk mitra Platinum. Slot pertama menggantikan tulisan Pancasila University, dengan dua slot lain tersusun di bawahnya.'],
    sleeve: ['02 — Lengan kanan / kiri', 'Pilihan penempatan logo sponsor pada lengan jersey untuk mitra Gold. Sisi, ukuran, dan aplikasi logo ditetapkan bersama sebelum produksi.'],
    back: ['03 — Punggung atas / bawah', 'Pilihan area sponsor di atas nama atau di bawah nomor punggung untuk mitra Gold. Penempatan mengikuti desain jersey yang disepakati bersama.']
  };
  document.querySelectorAll('[data-spot]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.spot;
    document.querySelectorAll('[data-spot]').forEach(item => {
      const active = item.dataset.spot === selected;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const title = document.createElement('strong');
    title.textContent = positions[selected][0];
    document.getElementById('placement-detail').replaceChildren(title, document.createElement('br'), document.createTextNode(positions[selected][1]));
  }));
  let previousDetails = [];
  window.addEventListener('beforeprint', () => {
    previousDetails = [...document.querySelectorAll('details')].map(item => item.open);
    document.querySelectorAll('details').forEach(item => {item.open = true;});
  });
  window.addEventListener('afterprint', () => {
    document.querySelectorAll('details').forEach((item, index) => {item.open = previousDetails[index] ?? false;});
  });
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
  if ('IntersectionObserver' in window) {
    const links = [...navigation.querySelectorAll('a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id));});
    }, {rootMargin: '-15% 0px -55% 0px'});
    links.forEach(link => {const section = document.querySelector(link.hash);if (section) observer.observe(section);});
  }
})();
