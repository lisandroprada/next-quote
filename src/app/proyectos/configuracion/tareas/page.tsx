'use client';

import React from 'react';
import TareasConfiguracion from './TareasConfiguracion';

export default function TareasPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tareas</h1>
      <TareasConfiguracion />
    </div>
  );
}
