"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SubmenuDrawer from './SubMenuDrawer';
import {
  HomeIcon,
  Squares2X2Icon,
  Bars3Icon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface SubMenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  submenu?: SubMenuItem[];
  badge?: string;
}

interface SidebarProps {
  collapsed?: boolean;
}

const navLinks: NavItem[] = [
  { href: '/dashboard', label: 'Dashboards', icon: HomeIcon },
  {
    label: 'Apps',
    icon: Squares2X2Icon,
    submenu: [
      { href: '/clients', label: 'Clients', icon: UserGroupIcon },
      { href: '/quotes', label: 'Quotes', icon: DocumentTextIcon },
      { href: '/calendar', label: 'Calendar', icon: CalendarIcon },
    ],
  },
  {
    label: 'Proyectos',
    icon: Bars3Icon,
    submenu: [
      { href: '/proyectos/presupuesto', label: 'Presupuesto', icon: DocumentTextIcon },
      { href: '/proyectos/configuracion', label: 'Configuración', icon: Bars3Icon },
      { href: '/proyectos/configuracion/tareas', label: 'Tareas', icon: DocumentTextIcon },
    ],
  },
  { label: 'Navigation', icon: Bars3Icon },
];

function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    setOpenSubmenu(null);
  }, [pathname]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <aside className={`fixed top-0 left-0 bg-gray-900 h-screen text-gray-300 flex flex-col transform transition-all duration-300
      ${collapsed ? '-translate-x-full' : 'translate-x-0'} w-28`} style={{ zIndex: 40 }}>
      <div className="py-8 px-4 flex justify-center items-center border-b border-gray-700">
        <Image
          src="/isotipo-propietas.png"
          alt="Propietas Logo"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
      
      <nav className="flex-1 flex flex-col items-center space-y-8 p-4 overflow-y-auto">
        {navLinks.map((link) => (
          <div key={link.label} className="relative">
            {link.submenu ? (
              <button
                onClick={() => toggleSubmenu(link.label)}
                className={`flex flex-col items-center p-3 rounded-xl hover:bg-gray-700 transition-all duration-200 w-20
                  ${openSubmenu === link.label ? 'bg-gray-700 text-white scale-110' : ''}`}
              >
                <link.icon className="h-7 w-7 mb-2" />
                <span className="text-xs text-center">{link.label}</span>
              </button>
            ) : (
              <Link
                href={link.href || '#'}
                className={`flex flex-col items-center p-3 rounded-xl hover:bg-gray-700 transition-all duration-200 w-20
                  ${pathname === link.href ? 'bg-gray-700 text-white scale-110' : ''}`}
              >
                <link.icon className="h-7 w-7 mb-2" />
                <span className="text-xs text-center">{link.label}</span>
              </Link>
            )}
            {link.submenu && openSubmenu === link.label && (
              <SubmenuDrawer
                isOpen={openSubmenu === link.label}
                onClose={() => setOpenSubmenu(null)}
                submenuItems={link.submenu}
                parentLabel={link.label}
              />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;