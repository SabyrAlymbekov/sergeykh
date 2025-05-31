"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { LogsService } from "../../lib/logsService";
import { OrderLog, TransactionLog } from "../../types/logs";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

interface LogDetailPageProps {
    logId: string;
    logType: "order" | "transaction";
}

const LogDetailPage: React.FC<LogDetailPageProps> = ({ logId, logType }) => {
    const router = useRouter();
    const [log, setLog] = useState<OrderLog | TransactionLog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLogDetails();
    }, [logId, logType]);

    const fetchLogDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            let foundLog = null;
            if (logType === "order") {
                foundLog = await LogsService.getOrderLogById(parseInt(logId));
            } else {
                foundLog = await LogsService.getTransactionLogById(parseInt(logId));
            }
            setLog(foundLog);
        } catch (err) {
            setError('Ошибка загрузки данных лога');
            console.error('Error fetching log details:', err);
        } finally {
            setLoading(false);
        }
    };

    // Функция для определения, является ли операция списанием
    const isDeductionOperation = (transactionType: string): boolean => {
        return ['balance_deduct', 'master_payment', 'curator_salary'].includes(transactionType);
    };

    const isOrderLog = (log: OrderLog | TransactionLog): log is OrderLog => {
        return 'order' in log && 'action' in log;
    };

    const isTransactionLog = (log: OrderLog | TransactionLog): log is TransactionLog => {
        return 'transaction_type' in log && 'amount' in log;
    };

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

    const renderOrderLogDetails = (orderLog: OrderLog) => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Информация о заказе</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="font-semibold">ID заказа:</span>
                        <span className="ml-2">#{orderLog.order.id}</span>
                    </div>
                    <div>
                        <span className="font-semibold">Описание:</span>
                        <p className="mt-1 p-3 bg-gray-50 rounded">{orderLog.order.description}</p>
                    </div>
                    <div>
                        <span className="font-semibold">Статус:</span>
                        <span className="ml-2">{orderLog.order.status}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Детали действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="font-semibold">Действие:</span>
                        <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getActionBadgeClass(orderLog.action)}`}>
                            {LogsService.formatActionName(orderLog.action)}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Описание:</span>
                        <p className="mt-1 p-3 bg-gray-50 rounded">{orderLog.description}</p>
                    </div>
                    {orderLog.old_value && (
                        <div>
                            <span className="font-semibold">Старое значение:</span>
                            <p className="mt-1 p-3 bg-red-50 rounded">{orderLog.old_value}</p>
                        </div>
                    )}
                    {orderLog.new_value && (
                        <div>
                            <span className="font-semibold">Новое значение:</span>
                            <p className="mt-1 p-3 bg-green-50 rounded">{orderLog.new_value}</p>
                        </div>
                    )}
                    <div>
                        <span className="font-semibold">Выполнил:</span>
                        <div className="mt-1">
                            <div className="font-medium">{orderLog.performed_by?.username || orderLog.performed_by?.email || 'Система'}</div>
                            {orderLog.performed_by?.email && (
                                <div className="text-sm text-muted-foreground">{orderLog.performed_by.email}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold">Дата:</span>
                        <div className="mt-1">
                            <div>{new Date(orderLog.created_at).toLocaleString('ru-RU')}</div>
                            <div className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(orderLog.created_at), { addSuffix: true, locale: ru })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderTransactionLogDetails = (transactionLog: TransactionLog) => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Информация о транзакции</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="font-semibold">Тип транзакции:</span>
                        <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTransactionTypeBadgeClass(transactionLog.transaction_type)}`}>
                            {LogsService.formatTransactionType(transactionLog.transaction_type)}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Сумма:</span>
                        <span className={`ml-2 font-medium text-lg ${
                            isDeductionOperation(transactionLog.transaction_type) || parseFloat(transactionLog.amount) < 0 
                                ? 'text-red-600' 
                                : 'text-green-600'
                        }`}>
                            {isDeductionOperation(transactionLog.transaction_type) && parseFloat(transactionLog.amount) > 0 
                                ? `-${transactionLog.amount}` 
                                : parseFloat(transactionLog.amount) >= 0 
                                    ? `+${transactionLog.amount}` 
                                    : transactionLog.amount
                            } ₸
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Описание:</span>
                        <p className="mt-1 p-3 bg-gray-50 rounded">{transactionLog.description}</p>
                    </div>
                    {transactionLog.user && (
                        <div>
                            <span className="font-semibold">Пользователь:</span>
                            <div className="mt-1">
                                <div className="font-medium">{transactionLog.user.username || transactionLog.user.email}</div>
                                <div className="text-sm text-muted-foreground">{transactionLog.user.email}</div>
                            </div>
                        </div>
                    )}
                    {transactionLog.order && (
                        <div>
                            <span className="font-semibold">Связанный заказ:</span>
                            <div className="mt-1 p-3 bg-blue-50 rounded">
                                <div className="font-medium">#{transactionLog.order.id}</div>
                                <div className="text-sm">{transactionLog.order.description}</div>
                            </div>
                        </div>
                    )}
                    {transactionLog.performed_by && (
                        <div>
                            <span className="font-semibold">Выполнил:</span>
                            <div className="mt-1">
                                <div className="font-medium">{transactionLog.performed_by.username || transactionLog.performed_by.email}</div>
                                <div className="text-sm text-muted-foreground">{transactionLog.performed_by.email}</div>
                            </div>
                        </div>
                    )}
                    <div>
                        <span className="font-semibold">Дата:</span>
                        <div className="mt-1">
                            <div>{new Date(transactionLog.created_at).toLocaleString('ru-RU')}</div>
                            <div className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(transactionLog.created_at), { addSuffix: true, locale: ru })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Загрузка деталей лога...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !log) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error || 'Лог не найден'}</p>
                        <Button onClick={() => router.back()}>Вернуться назад</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <Button 
                    variant="outline"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад к логам
                </Button>
                <h1 className="text-3xl font-bold">
                    Подробности лога #{log.id}
                </h1>
                <p className="text-muted-foreground">
                    {logType === "order" ? "Лог заказа" : "Лог транзакции"}
                </p>
            </div>

            {isOrderLog(log) && renderOrderLogDetails(log)}
            {isTransactionLog(log) && renderTransactionLogDetails(log)}
        </div>
    );
};

export default LogDetailPage;