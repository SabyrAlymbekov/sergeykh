"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';

// Интерфейс для пользователя
interface IUser {
    id: string;
    name: string;
    login: string;
    password: string;
    balance: number;
    role: 'оператор' | 'куратор' | 'мастер' | 'гарантийный мастер';
}

// Интерфейс для заказа (пример, можно изменить под ваши поля)
interface IOrder {
    id: string;
    userId: string;       // ID пользователя, который сделал заказ
    product: string;      // Название товара/услуги
    amount: number;       // Количество
    createdAt: Date;      // Дата создания заказа
}

// Тестовые данные пользователей
const dummyUsers: IUser[] = [
    { id: "1", name: "Иван Иванов", login: "ivan", password: "pass123", balance: 100, role: "оператор" },
    { id: "2", name: "Мария Петрова", login: "maria", password: "pass456", balance: 200, role: "куратор" },
    { id: "3", name: "Сергей Смирнов", login: "sergey", password: "pass789", balance: 300, role: "мастер" },
    { id: "4", name: "Анна Кузнецова", login: "anna", password: "pass000", balance: 400, role: "гарантийный мастер" },
];

// Тестовые данные заказов
const dummyOrders: IOrder[] = [
    { id: "101", userId: "1", product: "Ноутбук", amount: 1, createdAt: new Date("2023-01-10") },
    { id: "102", userId: "2", product: "Принтер", amount: 2, createdAt: new Date("2023-01-11") },
];

const BalanceManagement = () => {
    // Храним введённый ID пользователя
    const [userId, setUserId] = useState<string>('');
    // Храним найденного пользователя (или null, если не найден)
    const [user, setUser] = useState<IUser | null>(null);
    // Управляем состоянием диалога
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    // Храним новое значение баланса (отредактированное пользователем)
    const [newBalance, setNewBalance] = useState<string>('');
    // Храним сумму изменения (дельту)
    const [delta, setDelta] = useState<string>('');

    // Поиск пользователя по введённому ID
    const handleSearch = () => {
        const normalizedId = userId.trim();
        const foundUser = dummyUsers.find((u) => u.id === normalizedId);
        setUser(foundUser || null);
    };

    // При открытии диалога подставляем текущий баланс пользователя
    useEffect(() => {
        if (dialogOpen && user) {
            setNewBalance(String(user.balance));
            setDelta('');
        }
    }, [dialogOpen, user]);

    // Обработчики для увеличения/уменьшения баланса по дельте
    const handleIncrease = () => {
        if (newBalance !== '' && delta !== '') {
            const current = parseFloat(newBalance);
            const change = parseFloat(delta);
            setNewBalance(String(current + change));
        }
    };

    const handleDecrease = () => {
        if (newBalance !== '' && delta !== '') {
            const current = parseFloat(newBalance);
            const change = parseFloat(delta);
            setNewBalance(String(current - change));
        }
    };

    // Изменение баланса (пример без реального запроса к серверу)
    const handleBalanceUpdate = () => {
        if (user && newBalance !== '') {
            const updatedUser: IUser = {
                ...user,
                balance: parseFloat(newBalance),
            };
            // Здесь можно отправить запрос на сервер
            setUser(updatedUser);
            setDialogOpen(false);
            setNewBalance('');
            setDelta('');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Управление балансом</h2>

            {/* Поле для ввода ID и кнопка поиска */}
            <div className="mb-4 flex items-center">
                <Input
                    type="text"
                    placeholder="Введите ID пользователя"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Button onClick={handleSearch} className="ml-2">
                    Поиск
                </Button>
            </div>

            {/* Если пользователь найден, отображаем его данные */}
            {user && (
                <div className="border p-4 rounded">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Имя:</strong> {user.name}</p>
                    <p><strong>Логин:</strong> {user.login}</p>
                    <p><strong>Пароль:</strong> {user.password}</p>
                    <p><strong>Баланс:</strong> {user.balance}</p>
                    <p><strong>Должность:</strong> {user.role}</p>
                    <Button onClick={() => setDialogOpen(true)} className="mt-4">
                        Изменить баланс
                    </Button>
                </div>
            )}

            {/* Диалоговое окно для изменения баланса */}
            <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Изменение баланса</DialogTitle>
                    </DialogHeader>
                    <div className="my-4">
                        <Input
                            type="number"
                            placeholder="Новый баланс"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                        />
                    </div>
                    <div className="my-4 flex items-center space-x-2">
                        <Input
                            type="number"
                            placeholder="Сумма изменения"
                            value={delta}
                            onChange={(e) => setDelta(e.target.value)}
                        />
                        <Button onClick={handleDecrease} variant="outline">
                            Уменьшить
                        </Button>
                        <Button onClick={handleIncrease} variant="outline">
                            Увеличить
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleBalanceUpdate}>Сохранить</Button>
                        <Button variant="outline" className="ml-2" onClick={() => setDialogOpen(false)}>
                            Отмена
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BalanceManagement;
