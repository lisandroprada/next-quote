'use client';

import React from 'react';
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";
import TareasConfiguracion from './TareasConfiguracion';

export default function TareasPage() {
  return (
    <div className="container mx-auto p-4">
      <AppBreadcrumb 
        paths={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Proyectos', href: '/proyectos' },
          { label: 'Configuración', href: '/proyectos/configuracion' },
          { label: 'Tareas', isCurrentPage: true }
        ]} 
      />
      <h1 className="text-2xl font-bold mb-4">Gestión de Tareas</h1>
      <TareasConfiguracion />
    </div>
  );
}
