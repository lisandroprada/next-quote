"use client";

import { Card, Text, Metric } from "@tremor/react";

interface StatCardProps {
  title: string;
  metric: string | number;
  subtext?: string;
  color?: string;
}

const StatCard = ({ title, metric, subtext, color = "blue" }: StatCardProps) => (
  <Card className="bg-white">
    <Text className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
      {title}
    </Text>
    <Metric className={`text-${color}-500 truncate`}>{metric}</Metric>
    {subtext && (
      <Text className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
        {subtext}
      </Text>
    )}
  </Card>
);

export default function OverviewSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Due Tasks"
          metric="21"
          subtext="Completed: 13"
          color="blue"
        />
        <StatCard
          title="Tasks"
          metric="17"
          subtext="From yesterday: 9"
          color="red"
        />
        <StatCard
          title="Open"
          metric="24"
          subtext="Closed today: 19"
          color="orange"
        />
        <StatCard
          title="Proposals"
          metric="38"
          subtext="Implemented: 16"
          color="green"
        />
      </div>
    </div>
  );
}