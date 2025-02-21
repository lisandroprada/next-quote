import React from 'react';

function PropertiesSection() {
  // **En una aplicación real, aquí obtendrías datos de propiedades de tu backend**
  const properties = [
    { id: 1, address: '123 Main St', type: 'Casa', status: 'Activa', price: '$450,000' },
    { id: 2, address: '456 Oak Ave', type: 'Apartamento', status: 'En Venta', price: '$280,000' },
    // ... más propiedades ...
  ];

  return (
    <section className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Propiedades Recientes</h2>
      <div className="overflow-x-auto"> {/* Para scroll horizontal en tablas pequeñas */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap">{property.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">{property.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{property.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{property.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PropertiesSection;