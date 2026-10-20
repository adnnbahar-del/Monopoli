import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

// ── Inisialisasi Aksesibilitas dari Store Tersimpan ─────────────
// Harus dijalankan SEBELUM render agar tidak ada flash of wrong style.
(function initAksesibilitas() {
  try {
    const raw = localStorage.getItem('monepeca_pengaturan');
    if (!raw) return;
    const state = JSON.parse(raw) as { state?: { kontrasTinggi?: boolean; ukuranTeks?: string } };
    const s = state?.state ?? {};
    if (s.kontrasTinggi) {
      document.documentElement.classList.add('high-contrast');
    }
    if (s.ukuranTeks === 'besar') {
      document.documentElement.classList.add('text-besar');
    }
  } catch {
    // Jika localStorage corrupt, abaikan — tidak crash
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
