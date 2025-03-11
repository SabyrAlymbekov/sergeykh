"use client";

import * as React from "react";
import { OrdersDataTable, Order } from "./OrdersTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
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
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">открыть меню</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              row.original.actions
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

const actions = (
  <>
    <DropdownMenuItem>
          Взять заказ
        </DropdownMenuItem>
        <DropdownMenuItem>подробнее</DropdownMenuItem>
  </>
)

const ordersData: Order[] = [
  {
    contact: "+996 557 819 199",
    orderNumber: "3XP/3999",
    date: "2025-03-07 14:30",
    client: "Иванов И.И.",
    address: "ул. Абая, 10",
    problem: "Протечка крана",
    cost: "5000 ₸",
    executionTime: "2025-03-08 09:00",
    master: "Иванов Мастер",
    status: "Открытый",
    actions: actions
  },
];

export default function NewOrders() {
  return (
    <div>
       {/* <ContentLayout title={'Новые заказы'} footer={"1 штука"}> */}
        <OrdersDataTable data={ordersData} columns={columns} />
      {/* </ContentLayout> */}
    </div>
  );
}


