import React from 'react';

export default function Navbar({ title, onMenuClick }) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white p-3 lg:p-4 border-b shadow-sm">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - Mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 p-2 -ml-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 className="text-base lg:text-lg font-semibold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-3">
        <span className="hidden sm:inline text-xs lg:text-sm text-blue-800">Signed in</span>
        <button 
          onClick={() => { 
            localStorage.removeItem('token'); 
            localStorage.removeItem('role'); 
            localStorage.removeItem('currentUser');
            window.location.href = '/login'; 
          }} 
          className="text-xs lg:text-sm px-2 lg:px-3 py-1.5 lg:py-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}