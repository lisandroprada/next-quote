import React from 'react';
import PropertySummaryCard from './PropertySummaryCard'; // Reutilizamos PropertySummaryCard
import Link from 'next/link'; // Para enlaces de navegación

function BudgetsSection() {
  // **En una aplicación real, obtendrías datos de presupuestos desde tu backend**
  const budgetData = [
    { id: 1, budgetName: 'Kitchen Remodel - 123 Main St', propertyAddress: '123 Main St', status: 'Aprobado', totalAmount: '$15,000' },
    { id: 2, budgetName: 'Bathroom Renovation - 456 Oak Ave', propertyAddress: '456 Oak Ave', status: 'Pendiente', totalAmount: '$8,500' },
    { id: 3, budgetName: 'Roof Repair - 789 Pine Ln', propertyAddress: '789 Pine Ln', status: 'En Revisión', totalAmount: '$5,200' },
    // ... más datos de presupuestos ...
  ];

  // Métricas de ejemplo de presupuestos (serían dinámicas en la app real)
  const totalBudgets = budgetData.length;
  const budgetsApproved = budgetData.filter(budget => budget.status === 'Aprobado').length;
  const budgetsPendingApproval = budgetData.filter(budget => budget.status === 'Pendiente').length;

  return (
    <section className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between items-center">
        Presupuestos de Construcción Recientes
        <Link href="/budgets" className="text-sm text-blue-500 hover:underline">
          Ver todos los presupuestos
        </Link>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Tarjetas de resumen de métricas de presupuestos */}
        <PropertySummaryCard title="Presupuestos Totales" value={totalBudgets} icon="📑" />
        <PropertySummaryCard title="Presupuestos Aprobados" value={budgetsApproved} icon="✅" />
        <PropertySummaryCard title="Presupuestos Pendientes" value={budgetsPendingApproval} icon="⏳" />
      </div>

      <div className="overflow-x-auto"> {/* Scroll horizontal para tablas pequeñas */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Presupuesto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {budgetData.map((budget) => (
              <tr key={budget.id}>
                <td className="px-6 py-4 whitespace-nowrap">{budget.budgetName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{budget.propertyAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap">{budget.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{budget.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default BudgetsSection;