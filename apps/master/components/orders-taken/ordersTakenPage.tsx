// apps/master/components/orders-taken/ordersTakenPage.tsx
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";

import { OrdersTakenDataTable } from "@/components/orders-taken/OrdersTakenTable";
import {Order, ordersData} from "@/constants/orders"; // Используем единый источник типа


const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Номер заказа",
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Дата/время создания {column.getIsSorted() === "asc" ? "↑" : "↓"}
      </Button>
    ),
  },
  {
    accessorKey: "client",
    header: "Клиент",
  },
  {
    accessorKey: "address",
    header: "Адрес (сокращённый)",
  },
  {
    accessorKey: "problem",
    header: "Проблема",
  },
  {
    accessorKey: "cost",
    header: "Стоимость",
  },
  {
    accessorKey: "executionTime",
    header: "Время выполнения",
  },
  {
    accessorKey: "master",
    header: "Мастер",
  },
  {
    accessorKey: "status",
    header: "Статус",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => row.original.actions,
  },
];




export default function OrdersTakenPage() {
  return (
    <div className="p-6">
      <OrdersTakenDataTable data={ordersData} columns={columns} />
    </div>
  );
}