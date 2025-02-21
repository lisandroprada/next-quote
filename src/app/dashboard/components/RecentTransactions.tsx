"use client";

import { Card, Title, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, Badge } from "@tremor/react";

const transactions = [
  {
    id: "528651571NT",
    date: "Oct 07, 2019",
    name: "Morgan Page",
    amount: 1358.75,
    status: "COMPLETED"
  },
  {
    id: "426436904YT",
    date: "Dec 18, 2019",
    name: "Nita Hebert",
    amount: -1042.82,
    status: "COMPLETED"
  },
  {
    id: "685377421YT",
    date: "Dec 25, 2019",
    name: "Marsha Chambers",
    amount: 1828.16,
    status: "PENDING"
  },
  {
    id: "884960091RT",
    date: "Nov 29, 2019",
    name: "Charmaine Jackson",
    amount: 1647.55,
    status: "COMPLETED"
  },
  {
    id: "361402213NT",
    date: "Nov 24, 2019",
    name: "Maura Carey",
    amount: -927.43,
    status: "COMPLETED"
  }
];

export default function RecentTransactions() {
  return (
    <Card className="bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title>Recent transactions</Title>
          <p className="text-sm text-gray-500">1 pending, 4 completed</p>
        </div>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Transaction ID</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-xs">{item.id}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className={item.amount < 0 ? "text-red-500" : "text-green-500"}>
                ${Math.abs(item.amount).toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge
                  color={item.status === "COMPLETED" ? "green" : "yellow"}
                  size="sm"
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <button className="text-blue-500 text-sm hover:text-blue-700">
          See all transactions
        </button>
      </div>
    </Card>
  );
}
