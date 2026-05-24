export default async function handler(req, res) {
  // 1. Tangkap parameter 'path' dari website (misalnya: /trending/movie/week atau /movie/top_rated)
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Parameter path wajib diisi' });
  }

  // 2. Ambil API Key aman dari Environment Variables Vercel
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'TMDB_API_KEY belum dikonfigurasi di Vercel' });
  }

  // 3. Buat URL resmi untuk menembak server TMDB
  // Karena Vercel berada di luar negeri, Vercel bebas blokir dan bisa mengambil data dengan lancar
  const url = `https://api.themoviedb.org/3${path}?api_key=${apiKey}&language=id-ID`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // 4. JURUS CACHE VERCEL (Anti-Limit & Bebas Blokir)
    // Menyimpan hasil data di server Vercel selama 1 jam (3600 detik).
    // Jadi jika ada ribuan pengunjung, Vercel tidak akan meminta data lagi ke TMDB, melainkan langsung membagikan data yang sudah disimpan ini.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

    // CORS Header agar bisa diakses oleh file HTML kamu
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 5. Kirim data film yang berhasil diambil kembali ke HP pengguna
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Gagal menghubungi server film' });
  }
}
