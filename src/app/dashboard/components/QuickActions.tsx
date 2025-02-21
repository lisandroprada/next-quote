import React from 'react';
import Link from 'next/link';

function QuickActions() {
  return (
    <section className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
      <div className="flex space-x-4">
        <Link href="/properties/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Nueva Propiedad
        </Link>
        <Link href="/appraisals/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Nueva Tasación
        </Link>
        <Link href="/budgets/new" className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          Nuevo Presupuesto
        </Link>
      </div>
    </section>
  );
}

export default QuickActions;