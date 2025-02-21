import React from 'react';

interface PropertySummaryCardProps {
  title: string;
  value: string | number;
  icon: string; // Puedes usar emojis o componentes de iconos
}

function PropertySummaryCard({ title, value, icon }: PropertySummaryCardProps) {
  return (
    <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
      <div className="text-2xl">{icon}</div> {/* Icono */}
      <div>
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
}

export default PropertySummaryCard;