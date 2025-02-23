"use client";

import React from 'react';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface TopnavProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

function Topnav({ onToggleSidebar, sidebarCollapsed = false }: TopnavProps) {
  return (
    <header className={`fixed top-0 right-0 h-16 bg-white shadow-sm z-10 transition-all duration-300
      ${sidebarCollapsed ? 'left-0' : 'left-28'}`}>
      <div className="flex items-center justify-between h-full px-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle Sidebar"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <UserCircleIcon className="h-6 w-6 text-gray-600" />
            <span className="text-sm text-gray-700">Usuario</span>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                    >
                      Mi Perfil
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                    >
                      Configuración
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-red-50' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-700`}
                    >
                      Cerrar Sesión
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}

export default Topnav;