// src/pages/Katalog.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';
import FiltersPanel from '../components/FiltersPanel';

export default function Katalog() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ 
    search: '',      // Changed from 'q' to 'search'
    type: '',        // Book type (BOOK, JOURNAL, ARTICLE)
    genreId: ''      // Changed from 'genre' to 'genreId'
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getBackendOrigin = () => {
    const base = api?.defaults?.baseURL || '';
    if (!base) return 'http://localhost:5000';
    return base.replace(/\/api\/?$/, '');
  };
  const backendOrigin = getBackendOrigin();

  const coverBuku = (cover) => {
    if (!cover) return null;
    if (/^https?:\/\//.test(cover)) return cover;
    if (cover.startsWith('/')) return `${backendOrigin}${cover}`;
    return `${backendOrigin}/${cover}`;
  };

  const load = async () => {
    setLoading(true);
    setError('');

    const params = { page, limit: 12 };
    
    // Only add filters that have values
    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.type?.trim()) {
      params.type = filters.type.trim();
    }
    if (filters.genreId) {
      params.genreId = Number(filters.genreId);
    }

    const res = await api.get('/book', { params });

    const resData = res?.data?.data ?? res?.data ?? [];
    const list = Array.isArray(resData) ? resData : (resData.items ?? []);
    const count = Array.isArray(resData) ? list.length : (resData.total ?? list.length);

    const normalized = list.map(b => {
      const coverField = b.cover ?? ''; 
      const coverUrl = coverBuku(coverField);
      return {
        ...b,
        coverUrl,
      };
    });

    setItems(normalized);
    setTotal(count);
    setLoading(false);
  };

  useEffect(() => { 
    load(); 
  }, [filters.search, filters.type, filters.genreId, page]);

  return (
    <div className="content-fixed">
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>

          {/* Filters Panel - Desktop: sidebar, Mobile: modal */}
          <div className={`
            ${showFilters ? 'fixed inset-0 z-40 bg-black/50 lg:relative lg:bg-transparent' : 'hidden lg:block'}
            lg:w-64 lg:flex-shrink-0
          `}
          onClick={() => setShowFilters(false)}
          >
            <div 
              className={`
                ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                fixed lg:relative inset-y-0 left-0 w-64 bg-white lg:bg-transparent
                transform transition-transform duration-300 ease-in-out
                overflow-y-auto lg:overflow-visible
                z-50
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 lg:p-0">
                {/* Mobile Close Button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <FiltersPanel filters={filters} setFilters={setFilters} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Search */}
            <div className="bg-white p-3 lg:p-4 rounded-lg shadow-sm mb-4 lg:mb-6">
              <div className="flex gap-2 lg:gap-4 items-center">
                <div className="flex-1 relative">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={e => {
                      console.log('🔤 Search input changed:', e.target.value);
                      setPage(1);
                      setFilters(f => ({ ...f, search: e.target.value }));
                    }}
                    className="w-full text-gray-800 pl-9 lg:pl-10 pr-3 lg:pr-4 py-2 lg:py-3 border rounded-lg text-sm lg:text-base"
                    placeholder="Cari judul, penulis, deskripsi..."
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 lg:p-4 rounded-lg mb-4 lg:mb-6">
                <p className="text-red-700 text-sm lg:text-base">{error}</p>
              </div>
            )}

            {/* Loading */}
            {loading && <div className="p-6 lg:p-10 text-center text-sm lg:text-base">Memuat...</div>}

            {/* Items */}
            {!loading && !error && items.length === 0 && (
              <div className="p-6 lg:p-10 text-center text-gray-500 text-sm lg:text-base">Tidak ada item ditemukan</div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="space-y-3 lg:space-y-4">
                {items.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && items.length > 0 && (
              <div className="mt-6 lg:mt-8 flex items-center justify-center gap-2 lg:gap-3 pb-20 lg:pb-0">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 lg:px-4 py-2 border rounded disabled:opacity-40 text-sm lg:text-base"
                >
                  Prev
                </button>

                <span className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded text-sm lg:text-base">
                  {page}
                </span>

                <button
                  disabled={items.length < 12}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 lg:px-4 py-2 border rounded disabled:opacity-40 text-sm lg:text-base"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}