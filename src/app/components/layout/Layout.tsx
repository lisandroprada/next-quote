"use client";

import React, { ReactNode, useState } from 'react';
import Topnav from './Topnav';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={isSidebarCollapsed} />
      <Topnav 
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={isSidebarCollapsed}
      />
      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'pl-0' : 'pl-28'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;