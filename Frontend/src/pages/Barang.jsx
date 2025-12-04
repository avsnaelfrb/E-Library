import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Barang() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');

  const coverBuku = (cover) => {
    if (!cover) return null;
    if (/^https?:\/\//i.test(cover)) return cover;

    if (cover.startsWith('/uploads')) {
      const backendOrigin = window.__BACKEND_ORIGIN__ || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);
      return `${backendOrigin}${cover}`;
    }

    const backendOrigin = window.__BACKEND_ORIGIN__ || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);
    return `${backendOrigin}/${cover.startsWith('/') ? cover.slice(1) : cover}`;
  };

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/book', { params: { limit: 1000 } });
      const list = res?.data?.data || res?.data || [];

      if (!Array.isArray(list)) {
        setItems([]);
      } else {
        const normalizedList = list.map(item => ({
          id: item.id,
          title: item.title || '',
          author: item.author || '',
          description: item.description || '',
          type: item.type || '',
          genre: item.genre?.name || '',
          genreId: item.genreId,
          category: item.category || 'PHYSICAL',   // ⬅️ ADD THIS
          stock: item.stock ?? 0,
          cover: item.cover || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        
        setItems(normalizedList);
      }
    } catch (err) {
      console.error("Barang load failed", err);
      setError(err.response?.data?.message || 'Gagal memuat data barang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const filteredItems = items
    .filter(item => {
      const title = item.title || '';
      const author = item.author || '';
      const type = item.type || '';
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || type === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = sortBy === 'title' ? a.title :
                   sortBy === 'author' ? a.author :
                   a.id;
      const bVal = sortBy === 'title' ? b.title :
                   sortBy === 'author' ? b.author :
                   b.id;
      
      if (typeof aVal === 'number') return bVal - aVal;
      return String(aVal).localeCompare(String(bVal));
    });

  const categories = [...new Set(items.map(b => b.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 lg:py-20">
        <div className="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-3 lg:p-4 rounded text-sm lg:text-base">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="content-fixed">
      <div className="page-container">
      {/* Header */}
      <div className="mb-4 lg:mb-8">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-800 mb-1 lg:mb-2">Daftar Barang</h1>
        <p className="text-sm lg:text-base text-gray-600">Lihat semua koleksi buku perpustakaan</p>
      </div>

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-xs lg:text-sm">Total Buku</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-800">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-xs lg:text-sm">Kategori</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-800">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-xs lg:text-sm">Ditampilkan</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-800">{filteredItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter - Responsive */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4 mb-4 lg:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="relative">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari judul atau penulis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 lg:pl-10 pr-3 lg:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 text-white lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm lg:text-base"
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 text-white lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm lg:text-base"
          >
            <option value="title">Urutkan: Judul</option>
            <option value="author">Urutkan: Penulis</option>
            <option value="id">Urutkan: Terbaru</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={loadItems}
            className="px-3 lg:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada buku</h3>
            <p className="text-gray-500">Tidak ada buku yang sesuai dengan pencarian</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul Buku</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penulis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-100">
                          {item.cover ? (
                            <img
                              src={coverBuku(item.cover)}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = 'none';
                                const p = e.currentTarget.parentNode;
                                if (p) p.innerHTML = '📚';
                              }}
                            />
                          ) : (
                            <div className="text-lg">📚</div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description.substring(0, 50)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded uppercase">{item.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">{item.genre || '-'}</span>
                    </td>
                    {(() => {
                      const isPhysical  = item.category === 'PHYSICAL';
                      const isDigital   = item.category === 'DIGITAL';
                      const isAvailable = isPhysical ? item.stock > 0 : true;

                      const stockLabel = isPhysical
                        ? `${item.stock} buku`
                        : 'Ada';

                      const statusLabel = isPhysical
                        ? (isAvailable ? 'Tersedia' : 'Habis')
                        : 'Tersedia';

                      const statusClass = isPhysical
                        ? (isAvailable
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700')
                        : 'bg-blue-100 text-blue-700';

                      return (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {stockLabel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </>
                      );
                    })()}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg">
            <p className="text-gray-500 text-sm">Tidak ada buku yang sesuai dengan pencarian</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex gap-3 mb-3">
                <div className="w-16 h-20 rounded flex-shrink-0 overflow-hidden bg-gray-100">
                  {item.cover ? (
                    <img
                      src={coverBuku(item.cover)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                        const p = e.currentTarget.parentNode;
                        if (p) p.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">📚</div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 mb-1">{item.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{item.author}</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded uppercase">{item.type}</span>
                    {item.genre && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{item.genre}</span>
                    )}
                  </div>
                </div>
              </div>
              {(() => {
                    const isPhysical  = item.category === 'PHYSICAL';
                    const isDigital   = item.category === 'DIGITAL';
                    const isAvailable = isPhysical ? item.stock > 0 : true;

                    const stockLabel = isPhysical
                      ? `${item.stock} buku`
                      : 'Ada';

                    const statusLabel = isPhysical
                      ? (isAvailable ? 'Tersedia' : 'Habis')
                      : 'Tersedia';

                    const statusClass = isPhysical
                      ? (isAvailable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700')
                      : 'bg-blue-100 text-blue-700';

                    return (
                      <div className="flex justify-between items-center pt-2 border-t text-xs">
                        <span className="text-gray-600">Stok: {stockLabel}</span>
                        <span className={`px-2 py-1 rounded-full font-medium ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })()}
            </div>
          ))
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-4 lg:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 lg:p-4">
        <div className="flex items-start gap-2 lg:gap-3">
          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs lg:text-sm text-blue-800">
            <p className="font-medium mb-1">Informasi</p>
            <p>Data barang hanya dapat diupdate melalui menu <strong>Pengadaan</strong>, <strong>Peminjaman</strong>, dan <strong>Pengembalian</strong>.</p>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}