import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function FiltersPanel({ filters, setFilters }) {
  const [genres, setGenres] = useState([]);

  // Fetch genres from API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await api.get('/genre');
        const genreList = res?.data?.data || [];
        setGenres(genreList);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  const handleFilterChange = (key, value) => {
    console.log(`🔧 Filter changed: ${key} = ${value}`);
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      console.log('🔧 Updated filters:', updated);
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters({ search: '', type: '', genreId: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5">
      <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Filter</h2>

      {/* Jenis / Type */}
      <div className="mb-4 lg:mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis
        </label>
        <select
          value={filters.type || ''}
          onChange={e => handleFilterChange('type', e.target.value)}
          className="w-full bg-white text-gray-800 px-3 py-2.5 border border-gray-300 rounded-lg text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Semua Jenis</option>
          <option value="BOOK">Buku</option>
          <option value="JOURNAL">Jurnal</option>
          <option value="ARTICLE">Artikel</option>
        </select>
      </div>

      {/* Genre */}
      <div className="mb-4 lg:mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genre
        </label>
        <select
          value={filters.genreId || ''}
          onChange={e => handleFilterChange('genreId', e.target.value)}
          className="w-full bg-white text-gray-800 px-3 py-2.5 border border-gray-300 rounded-lg text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Semua Genre</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm lg:text-base font-medium border border-gray-300"
      >
        Reset Filter
      </button>
    </div>
  );
}