// @ts-ignore
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    // DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
// import Link from "next/link";
import {ActionsMenu} from "@workspace/ui/components/shared/constants/actionMenu";
import * as React from "react";
//



export enum ContentLayoutBg {
    Black,
    Transperent,
}



export type Order = {
    id: string; // Добавляем ID для навигации
    orderNumber: string;
    date: string;
    client: string;
    contact: string;
    address: string;
    problem: string;
    cost: string;
    executionTime: string;
    master: string;
    status: string;
    actions: React.ElementType;
};

export interface OrdersDataTableProps {
    data: Order[];
    columns: ColumnDef<Order>[];
}




// export type Order = {
//     orderNumber: string;
//     date: string; // e.g. "2025-03-07 14:30"
//     client: string;
//     address: string;
//     problem: string;
//     cost: string;
//     executionTime: string;
//     master: string;
//     status: string;
//     actions: React.ReactNode;
// };

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
                        <ActionsMenu />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const ordersData: Order[] = [
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
        status: "Открытый",
        actions: ActionsMenu,
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
        actions: ActionsMenu,
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
        actions: ActionsMenu,
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
        actions: ActionsMenu,
    },
    {
        id: "5",
        contact: "+996 559 789 012",
        orderNumber: "7XP/4003",
        date: "2025-03-11 16:40",
        client: "Миронова Л.А.",
        address: "ул. Байтик Баатыра, 50",
        problem: "Неисправность стиральной машины",
        cost: "9500 ₸",
        executionTime: "2025-03-12 11:30",
        master: "Романов Мастер",
        status: "Открытый",
        actions: ActionsMenu,
    },
    {
        id: "6",
        contact: "+996 501 222 333",
        orderNumber: "8XT/4004",
        date: "2025-03-12 08:10",
        client: "Алиев К.К.",
        address: "ул. Ахунбаева, 77",
        problem: "Не работает кондиционер",
        cost: "8000 ₸",
        executionTime: "2025-03-12 17:00",
        master: "Ильин Мастер",
        status: "В работе",
        actions: ActionsMenu,
    },
    {
        id: "7",
        contact: "+996 703 444 555",
        orderNumber: "9YT/4005",
        date: "2025-03-13 13:00",
        client: "Бекова Ж.М.",
        address: "ул. Чокморова, 20",
        problem: "Проблемы с отоплением",
        cost: "11000 ₸",
        executionTime: "2025-03-14 09:00",
        master: "Смирнов Мастер",
        status: "Ожидание",
        actions: ActionsMenu,
    },
    {
        id: "8",
        contact: "+996 707 666 777",
        orderNumber: "10ZR/4006",
        date: "2025-03-14 11:30",
        client: "Токтосунов Д.А.",
        address: "ул. Абдымомунова, 33",
        problem: "Замена замка в двери",
        cost: "6000 ₸",
        executionTime: "2025-03-14 16:00",
        master: "Егоров Мастер",
        status: "Завершено",
        actions: ActionsMenu,
    },
]





// export const columns: ColumnDef<Order>[] = [
//     {
//         accessorKey: "orderNumber",
//         header: "Номер заказа",
//     },
//     {
//         accessorKey: "date",
//         header: ({ column }) => (
//             <Button
//                 variant="ghost"
//                 onClick={() =>
//                     column.toggleSorting(column.getIsSorted() === "asc")
//                 }
//             >
//                 Дата/время создания {column.getIsSorted() === "asc" ? "↑" : "↓"}
//             </Button>
//         ),
//     },
//     {
//         accessorKey: "client",
//         header: "Клиент",
//     },
//     {
//         accessorKey: "address",
//         header: "Адрес (сокращённый)",
//     },
//     {
//         accessorKey: "problem",
//         header: "Проблема",
//     },
//     {
//         accessorKey: "cost",
//         header: "Стоимость",
//     },
//     {
//         accessorKey: "executionTime",
//         header: "Время выполнения",
//     },
//     {
//         accessorKey: "master",
//         header: "Мастер",
//     },
//     {
//         accessorKey: "status",
//         header: "Статус",
//     },
//     {
//         id: "actions",
//         enableHiding: false,
//         cell: ({ row }) => {
//             return (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                             <span className="sr-only">открыть меню</span>
//                             <MoreHorizontal />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Действия</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         {
//                             row.original.actions
//                         }
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             )
//         },
//     },
// ];
