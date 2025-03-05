"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";
import OverviewSection from "./components/OverviewSection";
import SalesChart from "./components/SalesChart";
import RecentTransactions from "./components/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <AppBreadcrumb 
        paths={[
          { label: 'Dashboard', isCurrentPage: true }
        ]} 
      />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OverviewSection />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6">
                <SalesChart />
              </div>
            </Card>
            <Card className="col-span-3">
              <div className="p-6">
                <RecentTransactions />
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <div className="p-6">
                <SalesChart />
              </div>
            </Card>
            <Card className="col-span-1">
              <div className="p-6">
                <SalesChart />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}