import React from 'react';
import PropertySummaryCard from './PropertySummaryCard'; // Reutilizamos PropertySummaryCard
import Link from 'next/link'; // Para enlaces de navegación

function AppraisalsSection() {
  // **En una aplicación real, obtendrías datos de tasaciones desde tu backend**
  const appraisalData = [
    { id: 1, propertyAddress: '901 River Rd', requestDate: '2024-08-08', status: 'Pendiente', estimatedValue: '$580,000' },
    { id: 2, propertyAddress: '345 Hilltop Dr', requestDate: '2024-08-05', status: 'Completada', estimatedValue: '$725,000' },
    { id: 3, propertyAddress: '678 Valley View', requestDate: '2024-08-01', status: 'En Proceso', estimatedValue: '$410,000' },
    // ... más datos de tasaciones ...
  ];

  // Métricas de ejemplo de tasaciones (serían dinámicas en la app real)
  const totalAppraisals = appraisalData.length;
  const appraisalsCompleted = appraisalData.filter(appraisal => appraisal.status === 'Completada').length;
  const appraisalsPending = appraisalData.filter(appraisal => appraisal.status === 'Pendiente').length;

  return (
    <section className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between items-center">
        Tasaciones Recientes
        <Link href="/appraisals" className="text-sm text-blue-500 hover:underline">
          Ver todas las tasaciones
        </Link>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Tarjetas de resumen de métricas de tasaciones */}
        <PropertySummaryCard title="Tasaciones Totales" value={totalAppraisals} icon="📊" />
        <PropertySummaryCard title="Tasaciones Completadas" value={appraisalsCompleted} icon="✅" />
        <PropertySummaryCard title="Tasaciones Pendientes" value={appraisalsPending} icon="⏳" />
      </div>

      <div className="overflow-x-auto"> {/* Scroll horizontal para tablas pequeñas */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Estimado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appraisalData.map((appraisal) => (
              <tr key={appraisal.id}>
                <td className="px-6 py-4 whitespace-nowrap">{appraisal.propertyAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appraisal.requestDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appraisal.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appraisal.estimatedValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AppraisalsSection;