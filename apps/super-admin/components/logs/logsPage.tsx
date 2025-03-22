"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@workspace/ui/components/table";

// Sample orders data
const orders = [
    {
        id: "ORD001",
        status: "Принятые",
        orderNumber: "3XP/3999",
        date: "2025-03-07 14:30",
        client: "Иванов И.И.",
        address: "ул. Абая, 10",
    },
    {
        id: "ORD002",
        status: "Завершенные",
        orderNumber: "4XT/4000",
        date: "2025-03-08 10:15",
        client: "Петров П.П.",
        address: "ул. Назарбаева, 25",
    },
    {
        id: "ORD003",
        status: "На переделке",
        orderNumber: "5YT/4001",
        date: "2025-03-09 12:45",
        client: "Семенова А.А.",
        address: "ул. Манаса, 5",
    },
];

// Sample invoices (logs) data
const invoices = [
    {
        id: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        id: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        id: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        id: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        id: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        id: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        id: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
];

const StatsPage = () => {
    const [activeTab, setActiveTab] = useState<"orders" | "logs" | "all">("orders");

    const renderOrders = () => (
        <div>
            <h2 className="text-xl font-semibold mb-2">Заказы</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Номер заказа</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead>Клиент</TableHead>
                            <TableHead>Адрес</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.orderNumber}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.client}</TableCell>
                                <TableCell>{order.address}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    const renderLogs = () => (
        <div>
            <h2 className="text-xl font-semibold mb-2">Логи транзакций</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Статус оплаты</TableHead>
                            <TableHead>Сумма</TableHead>
                            <TableHead>Способ оплаты</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.id}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.totalAmount}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    const renderAll = () => (
        <div className="space-y-8">
            {renderOrders()}
            {renderLogs()}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "orders":
                return renderOrders();
            case "logs":
                return renderLogs();
            case "all":
                return renderAll();
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Статистика, Логи и Заказы</h1>
            <div className="mb-6 flex flex-wrap justify-center gap-4">
                <Button
                    variant={activeTab === "orders" ? "default" : "outline"}
                    onClick={() => setActiveTab("orders")}
                >
                    Заказы
                </Button>
                <Button
                    variant={activeTab === "logs" ? "default" : "outline"}
                    onClick={() => setActiveTab("logs")}
                >
                    Логи
                </Button>
                <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    onClick={() => setActiveTab("all")}
                >
                    Всё
                </Button>
            </div>
            {renderContent()}
        </div>
    );
};

export default StatsPage;
