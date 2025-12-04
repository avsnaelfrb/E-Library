import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Pengadaan({ onAdded }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    type: 'BOOK',
    genreId: '',
    stock: 1,
    year: '',
    category: 'PHYSICAL', // PHYSICAL | DIGITAL
  });

  const [coverFile, setCoverFile] = useState(null);
  const [coverFileName, setCoverFileName] = useState('');
  const [bookFile, setBookFile] = useState(null);
  const [bookFileName, setBookFileName] = useState('');

  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setLoadingGenres(true);
    try {
      const res = await api.get('/genre');
      const body = res?.data ?? res;
      const list = Array.isArray(body)
        ? body
        : Array.isArray(body?.data)
        ? body.data
        : [];
      setGenres(list);
    } catch (err) {
      console.error('Error loading genres:', err);
      setError('Gagal memuat genre');
    } finally {
      setLoadingGenres(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['stock', 'genreId', 'year'].includes(name)) {
      const numValue = value === '' ? '' : Number(value);
      setForm((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setError('');
    setSuccess('');
  };

  const handleCoverChange = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setCoverFile(f);
    setCoverFileName(f ? f.name : '');
    setError('');
    setSuccess('');
  };

  const handleBookFileChange = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setBookFile(f);
    setBookFileName(f ? f.name : '');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError('');
    setSuccess('');
    setSubmitting(true);

    // Basic validations
    if (!form.title || !form.title.trim()) {
      setError('Judul wajib diisi');
      setSubmitting(false);
      return;
    }
    if (!form.author || !form.author.trim()) {
      setError('Penulis wajib diisi');
      setSubmitting(false);
      return;
    }
    if (!form.genreId) {
      setError('Genre wajib dipilih');
      setSubmitting(false);
      return;
    }
    if (!form.year) {
      setError('Tahun wajib diisi');
      setSubmitting(false);
      return;
    }
    if (form.category === 'DIGITAL' && !bookFile) {
      setError('Buku digital wajib menyertakan file PDF!');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append('title', form.title.trim());
      formData.append('author', form.author.trim());
      if (form.description) {
        formData.append('description', form.description.trim());
      }

      formData.append('type', form.type || 'BOOK');
      formData.append('genreId', String(form.genreId));
      formData.append('stock', String(Number(form.stock) || 1));
      formData.append('year', String(form.year));
      formData.append('category', form.category || 'PHYSICAL');

      if (coverFile) {
        formData.append('cover', coverFile); // matches multer field "cover"
      }

      if (form.category === 'DIGITAL' && bookFile) {
        formData.append('bookFile', bookFile); // matches multer field "bookFile"
      }

      const res = await api.post('/book', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Buku berhasil ditambahkan!');

      // Reset form
      setForm({
        title: '',
        author: '',
        description: '',
        type: 'BOOK',
        genreId: '',
        stock: 1,
        year: '',
        category: 'PHYSICAL',
      });
      setCoverFile(null);
      setCoverFileName('');
      setBookFile(null);
      setBookFileName('');

      if (onAdded && res.data) {
        onAdded(res.data?.data || res.data);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      const serverMsg =
        err.response?.data?.message || err.response?.data || err.message;
      setError(
        typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: '',
      author: '',
      description: '',
      type: 'BOOK',
      genreId: '',
      stock: 1,
      year: '',
      category: 'PHYSICAL',
    });
    setCoverFile(null);
    setCoverFileName('');
    setBookFile(null);
    setBookFileName('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">
        Form Pengadaan Buku
      </h2>

      {error && (
        <div className="mb-4 p-3 lg:p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-start gap-2 lg:gap-3">
            <svg
              className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs lg:text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 lg:p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <div className="flex items-start gap-2 lg:gap-3">
            <svg
              className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs lg:text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4"
      >
        {/* Judul */}
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Judul Buku <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Masukkan judul buku"
            className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
            required
          />
        </div>

        {/* Penulis */}
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Penulis <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Nama penulis"
            className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
            required
          />
        </div>

        {/* Deskripsi */}
        <div className="lg:col-span-2">
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi singkat buku"
            rows="3"
            className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
          />
        </div>

        {/* Cover (file upload) */}
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Upload Cover{' '}
            <span className="text-gray-400 text-xs ml-1">(opsional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-sm lg:text-base"
          />
          {coverFileName && (
            <p className="text-xs mt-1 text-gray-600">File: {coverFileName}</p>
          )}
        </div>

        {/* Tipe */}
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Tipe
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
          >
            <option value="BOOK">📚 Buku</option>
            <option value="JOURNAL">📰 Jurnal</option>
            <option value="ARTICLE">📄 Artikel</option>
          </select>
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
          >
            <option value="PHYSICAL">📗 Fisik</option>
            <option value="DIGITAL">💾 Digital</option>
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Genre <span className="text-red-500">*</span>
          </label>
          {loadingGenres ? (
            <div className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm lg:text-base">
              Memuat genre...
            </div>
          ) : (
            <select
              name="genreId"
              value={form.genreId}
              onChange={handleChange}
              className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
              required
            >
              <option value="">-- Pilih Genre --</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Tahun */}
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Tahun Terbit
          </label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="2024"
            min="1000"
            max={new Date().getFullYear()}
            className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
          />
        </div>

        {/* Stok */}
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
            Jumlah Stok
          </label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="1"
            min="0"
            className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
          />
        </div>

        {/* File PDF (Digital only) */}
        {form.category === 'DIGITAL' && (
          <div className="lg:col-span-2">
            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
              File Buku (PDF){' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleBookFileChange}
              className="w-full text-white px-3 lg:px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-sm lg:text-base"
            />
            {bookFileName && (
              <p className="text-xs mt-1 text-gray-600">
                File: {bookFileName}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row justify-end gap-2 lg:gap-3 pt-2 lg:pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 lg:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm lg:text-base"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-4 lg:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 lg:h-5 lg:w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Simpan Buku
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
