"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubmenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface SubmenuDrawerProps {
  submenuItems: SubmenuItem[];
  isOpen: boolean;
  onClose: () => void;
  parentLabel: string;
}

function SubmenuDrawer({ submenuItems, isOpen, onClose, parentLabel }: SubmenuDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-28 h-screen w-64 bg-gray-900 text-gray-300 shadow-lg z-50 transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold uppercase text-white">{parentLabel}</h2>
        </div>
        <ul className="p-4 space-y-2">
          {submenuItems.map((sublink) => (
            <li key={sublink.href}
                className="transform transition-transform duration-200 hover:scale-105">
              <Link
                href={sublink.href}
                className={`flex items-center space-x-2 w-full p-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 
                  ${pathname === sublink.href ? 'bg-gray-700 text-white font-semibold' : ''}`}
              >
                <sublink.icon className="h-5 w-5" />
                <span>{sublink.label}</span>
                {sublink.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500 text-white">
                    {sublink.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SubmenuDrawer;