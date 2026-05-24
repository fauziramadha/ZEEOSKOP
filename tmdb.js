export default async function handler(req, res) {
    // 1. Tangkap parameter dari request website kamu (misal: /trending/movie/week)
    const { path } = req.query; 

    // 2. Ambil API Key rahasia dari Environment Variables Vercel
    const API_KEY = process.env.TMDB_API_KEY; 

    // 3. Vercel yang akan menembak TMDB (Karena server Vercel di luar negeri, tidak akan diblokir ISP Indonesia!)
    const url = `https://api.themoviedb.org/3${path}?api_key=${API_KEY}&language=id-ID`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // 4. Kirim hasilnya kembali ke HP pengguna
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghubungi server film' });
    }
}
