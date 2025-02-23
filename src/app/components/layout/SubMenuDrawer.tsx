"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "240px", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-[104px] top-0 h-screen bg-gray-800 border-l border-gray-700 overflow-hidden z-40"
          style={{
            boxShadow: "4px 0 15px rgba(0, 0, 0, 0.3)"
          }}
        >
          <div className="h-full flex flex-col w-[240px]">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-gray-200">{parentLabel}</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-1">
                {submenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-gray-700 text-white' 
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                          isActive ? 'bg-gray-600' : 'bg-gray-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SubmenuDrawer;