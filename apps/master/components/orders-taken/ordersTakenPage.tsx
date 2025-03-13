// apps/master/components/orders-taken/ordersTakenPage.tsx
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { OrdersTakenDataTable } from "@/components/orders-taken/OrdersTakenTable";
import { Order } from "@/constants/types"; // Используем единый источник типа

const ActionsMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Открыть меню</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Действия</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Отменить заказ</DropdownMenuItem>
      <DropdownMenuItem>Подробнее</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

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


const ordersData: Order[] = [
  {
    id: "1",
    contact: "+996 557 819 199",
    orderNumber: "3XP/3999",
    date: "2025-03-07 14:30",
    client: "Иванов И.И.",
    address: "ул. Абая, 10",
    problem: "Протечка крана",
    cost: "5000 ₸",
    executionTime: "2025-03-08 09:00",
    master: "Иванов Мастер",
    status: "В работе",
    actions: <ActionsMenu />,
  },
  {
    id: "2",
    contact: "+996 555 123 456",
    orderNumber: "4XT/4000",
    date: "2025-03-08 10:15",
    client: "Петров П.П.",
    address: "ул. Назарбаева, 25",
    problem: "Не работает розетка",
    cost: "3500 ₸",
    executionTime: "2025-03-08 16:00",
    master: "Сидоров Мастер",
    status: "В работе",
    actions: <ActionsMenu />,
  },
  {
    id: "3",
    contact: "+996 700 987 654",
    orderNumber: "5YT/4001",
    date: "2025-03-09 12:45",
    client: "Семенова А.А.",
    address: "ул. Манаса, 5",
    problem: "Засор в канализации",
    cost: "7500 ₸",
    executionTime: "2025-03-09 18:30",
    master: "Кузнецов Мастер",
    status: "Ожидание",
    actions: <ActionsMenu />,
  },
  {
    id: "4",
    contact: "+996 777 654 321",
    orderNumber: "6ZR/4002",
    date: "2025-03-10 09:20",
    client: "Ковалёв В.В.",
    address: "пр. Тыныстанова, 15",
    problem: "Замена проводки",
    cost: "12000 ₸",
    executionTime: "2025-03-11 14:00",
    master: "Борисов Мастер",
    status: "Завершено",
    actions: <ActionsMenu />,
  },
];

export default function OrdersTakenPage() {
  return (
    <div className="p-6">
      <OrdersTakenDataTable data={ordersData} columns={columns} />
    </div>
  );
}