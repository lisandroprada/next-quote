import React, { ReactNode } from 'react';

import Topnav from '../../app/components/layout/Topnav';
import Sidebar from '../../app/components/layout/Sidebar';

interface LayoutProps {
  children: ReactNode; // Define el tipo de la prop 'children'
}

function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Topnav />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px' }}>
          {children} {/* Aquí se renderizará el contenido de cada página */}
        </main>
      </div>
    </div>
  );
}

export default Layout;