import React from 'react';
import PropertySummaryCard from './PropertySummaryCard'; // Reutilizamos PropertySummaryCard
import Link from 'next/link'; // Para posibles enlaces a la sección de ventas completa

function SalesSection() {
  // **En una aplicación real, aquí obtendrías datos de ventas desde tu backend**
  const salesData = [
    { id: 1, propertyAddress: '789 Pine Ln', buyer: 'Jane Doe', saleDate: '2024-08-05', salePrice: '$620,000' },
    { id: 2, propertyAddress: '101 Elm St', buyer: 'Peter Smith', saleDate: '2024-08-02', salePrice: '$395,000' },
    { id: 3, propertyAddress: '222 Oak Ave', buyer: 'Alice Johnson', saleDate: '2024-07-28', salePrice: '$510,000' },
    // ... más datos de ventas ...
  ];

  // Métricas de ejemplo (también serían dinámicas en la app real)
  const totalSalesThisMonth = '$1,250,000';
  const averageSalePrice = '$480,000';
  const salesCountThisMonth = salesData.length; // Usando la longitud del array de ejemplo

  return (
    <section className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between items-center">
        Ventas Recientes
        <Link href="/sales" className="text-sm text-blue-500 hover:underline">
          Ver todas las ventas
        </Link>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Tarjetas de resumen de métricas de ventas */}
        <PropertySummaryCard title="Ventas Este Mes" value={totalSalesThisMonth} icon="📈" />
        <PropertySummaryCard title="Precio Venta Promedio" value={averageSalePrice} icon="💰" />
        <PropertySummaryCard title="Cantidad de Ventas" value={salesCountThisMonth} icon="🔢" />
      </div>

      <div className="overflow-x-auto"> {/* Para scroll horizontal en tablas pequeñas */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Venta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesData.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap">{sale.propertyAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.buyer}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.saleDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.salePrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SalesSection;