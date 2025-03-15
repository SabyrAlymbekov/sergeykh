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
import Link from "next/link";

export type Order = {
  orderNumber: string;
  date: string; // e.g. "2025-03-07 14:30"
  client: string;
  address: string;
  problem: string;
  cost: string;
  executionTime: string;
  master: string;
  status: string;
  actions: React.ReactNode;
};

export const columns: ColumnDef<Order>[] = [
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
            {row.original.actions}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const ordersData: Order[] = [
  {
    orderNumber: "3XP/3999",
    date: "2025-03-07 14:30",
    client: "Иванов И.И.",
    address: "ул. Абая, 10",
    problem: "Протечка крана",
    cost: "5000 ₸",
    executionTime: "2025-03-08 09:00",
    master: "Иванов Мастер",
    status: "Открытый",
    actions: "",
  },
  {
    orderNumber: "3XP/4000",
    date: "2025-03-08 10:00",
    client: "Петров П.П.",
    address: "ул. Ленина, 15",
    problem: "Не работает розетка",
    cost: "3000 ₸",
    executionTime: "2025-03-09 11:00",
    master: "Петров Мастер",
    status: "В процессе",
    actions: "",
  },
  {
    orderNumber: "3XP/4001",
    date: "2025-03-09 12:00",
    client: "Сидоров С.С.",
    address: "ул. Гагарина, 20",
    problem: "Засор в раковине",
    cost: "4000 ₸",
    executionTime: "2025-03-10 13:00",
    master: "Сидоров Мастер",
    status: "Завершён",
    actions: "",
  },
  {
    orderNumber: "3XP/4002",
    date: "2025-03-10 14:00",
    client: "Кузнецов К.К.",
    address: "ул. Пушкина, 25",
    problem: "Не работает кондиционер",
    cost: "7000 ₸",
    executionTime: "2025-03-11 15:00",
    master: "Кузнецов Мастер",
    status: "Открытый",
    actions: "",
  },
  {
    orderNumber: "3XP/4003",
    date: "2025-03-11 16:00",
    client: "Михайлов М.М.",
    address: "ул. Чехова, 30",
    problem: "Не работает стиральная машина",
    cost: "8000 ₸",
    executionTime: "2025-03-12 17:00",
    master: "Михайлов Мастер",
    status: "В процессе",
    actions: "",
  },
].map((order) => ({
  ...order,
  actions: (
    <>
      <DropdownMenuItem>Взять заказ</DropdownMenuItem>
      <DropdownMenuItem><Link href={`/orders/${order.orderNumber}`}>подробнее</Link></DropdownMenuItem>
    </>
  )
}));

export enum ContentLayoutBg {
  Grey,
  Transperent,
}
