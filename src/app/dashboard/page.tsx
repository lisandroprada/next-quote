"use client";

import OverviewSection from "./components/OverviewSection";
import SalesChart from "./components/SalesChart";
import RecentTransactions from "./components/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        {/* Overview Section */}
        <OverviewSection />
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SalesChart />
          <SalesChart />
        </div>
        
        {/* Recent Transactions */}
        <RecentTransactions />
      </div>
    </div>
  );
}