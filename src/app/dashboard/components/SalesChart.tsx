"use client";

import { Card, Title, AreaChart } from "@tremor/react";
import { useState } from "react";

const data = [
  { date: "Mon", "New Issues": 42, Closed: 10 },
  { date: "Tue", "New Issues": 28, Closed: 10 },
  { date: "Wed", "New Issues": 43, Closed: 7 },
  { date: "Thu", "New Issues": 34, Closed: 11 },
  { date: "Fri", "New Issues": 20, Closed: 8 },
  { date: "Sat", "New Issues": 25, Closed: 10 },
  { date: "Sun", "New Issues": 22, Closed: 16 },
];

export default function SalesChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  return (
    <Card className="bg-white">
      <div className="flex justify-between items-center mb-4">
        <Title>Ventas Mensuales</Title>
        <div className="flex items-center gap-4">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              selectedPeriod === "Last Week"
                ? "text-gray-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setSelectedPeriod("Last Week")}
          >
            Última Semana
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              selectedPeriod === "This Week"
                ? "text-gray-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setSelectedPeriod("This Week")}
          >
            Esta Semana
          </button>
        </div>
      </div>
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index="date"
        categories={["New Issues", "Closed"]}
        colors={["indigo", "cyan"]}
        valueFormatter={(number: number) =>
          Intl.NumberFormat("us").format(number).toString()
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-2xl font-semibold text-indigo-600">214</p>
          <p className="text-sm text-gray-600">Ventas Totales</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-semibold text-green-600">75</p>
          <p className="text-sm text-gray-600">Ventas del Mes</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-2xl font-semibold text-blue-600">3</p>
          <p className="text-sm text-gray-600">Ventas del Año</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-2xl font-semibold text-purple-600">6</p>
          <p className="text-sm text-gray-600">Ventas Totales del Año</p>
        </div>
      </div>
    </Card>
  );
}