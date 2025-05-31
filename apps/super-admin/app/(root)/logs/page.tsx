"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@workspace/ui/components/table";
import { LogsService } from "@/lib/logsService";
import { OrderLog, TransactionLog } from "@/types/logs";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const LogsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"orders" | "transactions" | "all">("orders");
    const [orderLogs, setOrderLogs] = useState<OrderLog[]>([]);
    const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const [orderLogsData, transactionLogsData] = await Promise.all([
                LogsService.getOrderLogs(),
                LogsService.getTransactionLogs(),
            ]);
            setOrderLogs(orderLogsData);
            setTransactionLogs(transactionLogsData);
        } catch (err) {
            setError('Ошибка загрузки логов');
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderOrderLogs = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4">Логи заказов</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Заказ</TableHead>
                            <TableHead>Действие</TableHead>
                            <TableHead>Выполнил</TableHead>
                            <TableHead>Описание</TableHead>
                            <TableHead>Старое значение</TableHead>
                            <TableHead>Новое значение</TableHead>
                            <TableHead>Дата</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <Link 
                                        href={`/logs/order/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <div>
                                            <div className="font-medium">#{log.order.id}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {log.order.description.substring(0, 50)}...
                                            </div>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/logs/order/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getActionBadgeClass(log.action)}`}>
                                            {LogsService.formatActionName(log.action)}
                                        </span>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/logs/order/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <div>
                                            <div className="font-medium">{log.performed_by?.username || log.performed_by?.email || 'Система'}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {log.performed_by?.email || ''}
                                            </div>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                    <Link 
                                        href={`/logs/order/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <div className="truncate" title={log.description}>
                                            {log.description}
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                    <Link 
                                        href={`/logs/order/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        {log.old_value && (
                                            <div className="text-sm bg-red-50 px-2 py-1 rounded truncate">
                                                {log.old_value}
                                            </div>
                                        )}
                                    </Link>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                    <Link 
                                        href={`/logs/order/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        {log.new_value && (
                                            <div className="text-sm bg-green-50 px-2 py-1 rounded truncate">
                                                {log.new_value}
                                            </div>
                                        )}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/logs/order/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <div className="text-sm">
                                            {formatDistanceToNow(new Date(log.created_at), { 
                                                addSuffix: true, 
                                                locale: ru 
                                            })}
                                        </div>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    const renderTransactionLogs = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4">Логи транзакций</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Пользователь</TableHead>
                            <TableHead>Тип транзакции</TableHead>
                            <TableHead>Сумма</TableHead>
                            <TableHead>Описание</TableHead>
                            <TableHead>Заказ</TableHead>
                            <TableHead>Выполнил</TableHead>
                            <TableHead>Дата</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactionLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <Link 
                                        href={`/logs/transaction/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        {log.user ? (
                                            <div>
                                                <div className="font-medium">{log.user.username || log.user.email}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {log.user.email}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">Система</span>
                                        )}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/logs/transaction/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTransactionTypeBadgeClass(log.transaction_type)}`}>
                                            {LogsService.formatTransactionType(log.transaction_type)}
                                        </span>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/logs/transaction/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <span className={`font-medium ${parseFloat(log.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {parseFloat(log.amount) >= 0 ? '+' : ''}{log.amount} ₸
                                        </span>
                                    </Link>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                    <Link 
                                        href={`/logs/transaction/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <div className="truncate" title={log.description}>
                                            {log.description}
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/logs/transaction/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        {log.order && (
                                            <div>
                                                <div className="font-medium">#{log.order.id}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {log.order.description.substring(0, 30)}...
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/logs/transaction/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        {log.performed_by ? (
                                            <div>
                                                <div className="font-medium">{log.performed_by.username || log.performed_by.email}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {log.performed_by.email}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">Автоматически</span>
                                        )}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/logs/transaction/${log.id}`}
                                        className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                                    >
                                        <div className="text-sm">
                                            {formatDistanceToNow(new Date(log.created_at), { 
                                                addSuffix: true, 
                                                locale: ru 
                                            })}
                                        </div>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    const renderAllLogs = () => (
        <div className="space-y-8">
            {renderOrderLogs()}
            {renderTransactionLogs()}
        </div>
    );

    const getActionBadgeClass = (action: string) => {
        switch (action) {
            case 'created':
                return 'bg-blue-100 text-blue-800';
            case 'master_assigned':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-purple-100 text-purple-800';
            case 'transferred':
                return 'bg-orange-100 text-orange-800';
            case 'deleted':
                return 'bg-red-100 text-red-800';
            case 'approved':
                return 'bg-emerald-100 text-emerald-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTransactionTypeBadgeClass = (type: string) => {
        switch (type) {
            case 'balance_top_up':
                return 'bg-green-100 text-green-800';
            case 'balance_deduct':
                return 'bg-red-100 text-red-800';
            case 'profit_distribution':
                return 'bg-blue-100 text-blue-800';
            case 'master_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'curator_salary':
                return 'bg-indigo-100 text-indigo-800';
            case 'company_income':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Загрузка логов...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={fetchLogs}>Попробовать снова</Button>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case "orders":
                return renderOrderLogs();
            case "transactions":
                return renderTransactionLogs();
            case "all":
                return renderAllLogs();
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Логи системы</h1>
            <div className="mb-6 flex flex-wrap justify-center gap-4">
                <Button
                    variant={activeTab === "orders" ? "default" : "outline"}
                    onClick={() => setActiveTab("orders")}
                >
                    Логи заказов ({orderLogs.length})
                </Button>
                <Button
                    variant={activeTab === "transactions" ? "default" : "outline"}
                    onClick={() => setActiveTab("transactions")}
                >
                    Логи транзакций ({transactionLogs.length})
                </Button>
                <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    onClick={() => setActiveTab("all")}
                >
                    Все логи
                </Button>
            </div>
            {renderContent()}
        </div>
    );
};

export default LogsPage;
