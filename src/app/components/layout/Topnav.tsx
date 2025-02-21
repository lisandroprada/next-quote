"use client";

import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface TopnavProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

function Topnav({ onToggleSidebar, sidebarCollapsed = false }: TopnavProps) {
  return (
    <header className={`fixed top-0 right-0 h-16 bg-white shadow-sm z-10 transition-all duration-300
      ${sidebarCollapsed ? 'left-0' : 'left-28'}`}>
      <div className="flex items-center h-full px-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle Sidebar"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
}

export default Topnav;