"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@shared/constants/constants";
import { Master, } from "@shared/constants/types";
import { HistoryPayments } from "@shared/finances/chartFinances/historyPayments";
import { OrdersDataTable } from "@shared/orders/(beta-orders)/OrdersTable";
import { columns, Order as OrderType  } from "@shared/constants/orders";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { MasterCalendar } from "@workspace/ui/components/master-calendar";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@workspace/ui/components/dialog";

interface MasterProfileProps {
    id: string;
}

/**
 * Профиль мастера c балансом, графиком, логом платежей и списком заказов.
 */
const MasterProfile: React.FC<MasterProfileProps> = ({ id }) => {
    // ──────────────── state ────────────────
    const [master, setMaster] = useState<Master | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
    const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
    const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [topUpAmount, setTopUpAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");

    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

    // ──────────────── helpers ────────────────
    const fetchProfile = async () => {
        setLoadingProfile(true);
        setError(null);
        try {
            const res = await axios.get<Master>(`${API}/users/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setMaster(res.data);
        } catch (err) {
            console.error("Ошибка загрузки профиля мастера", err);
            setError("Не удалось получить данные мастера");
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchBalance = async () => {
        setLoadingBalance(true);
        try {
            const res = await axios.get<{ balance: number }>(`${API}/balance/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setBalance(res.data.balance);
        } catch (err) {
            console.error("Ошибка получения баланса мастера", err);
        } finally {
            setLoadingBalance(false);
        }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await axios.get<OrderType[]>(
                `${API}/orders/master/${id}/`,
                { headers: { Authorization: `Token ${token}` } }
            );
            setOrders(res.data);
        } catch (err) {
            console.error("Ошибка загрузки заказов мастера", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchBalance();
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // ──────────────── handlers ────────────────
    const topUpOrWithdraw = async (
        action: "top-up" | "deduct",
        amount: string,
        resetAmount: () => void
    ) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert("Введите корректную сумму");
            return;
        }

        try {
            await axios.post(
                `${API}/balance/${id}/${action}/`,
                { amount: numAmount },
                { headers: { Authorization: `Token ${token}` } }
            );
            fetchBalance(); // Обновить баланс
            resetAmount();
        } catch (err) {
            console.error(`Ошибка при ${action === "top-up" ? "пополнении" : "списании"}`, err);
            alert(`Не удалось ${action === "top-up" ? "пополнить" : "списать"} баланс`);
        }
    };

    // ──────────────── render ────────────────
    if (loadingProfile) {
        return <div>Загрузка профиля...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!master) {
        return <div>Мастер не найден</div>;
    }

    return (
        <div className="container p-4">
            {/* Заголовок с именем мастера */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    {master.first_name} {master.last_name}
                </h1>
                <p className="text-gray-600">{master.email}</p>
                <p className="text-sm text-gray-500">ID: {master.id}</p>
            </div>

            {/* Баланс и операции */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Баланс */}
                <div className="rounded-xl border px-5 py-7">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Баланс</h2>
                        {loadingBalance ? (
                            <div>Загрузка...</div>
                        ) : (
                            <span className="text-2xl font-bold">{balance.toFixed(2)} ₽</span>
                        )}
                    </div>

                    {/* Кнопки управления балансом */}
                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1">
                                    Пополнить
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Пополнить баланс</DialogTitle>
                                </DialogHeader>
                                <Input
                                    type="number"
                                    placeholder="Сумма"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    className="w-full my-4"
                                />
                                <DialogFooter className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button
                                        onClick={() => topUpOrWithdraw("top-up", topUpAmount, () => setTopUpAmount(""))}
                                    >
                                        ОК
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1">
                                    Списать
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Списать с баланса</DialogTitle>
                                </DialogHeader>
                                <Input
                                    type="number"
                                    placeholder="Сумма"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full my-4"
                                />
                                <DialogFooter className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button
                                        onClick={() => topUpOrWithdraw("deduct", withdrawAmount, () => setWithdrawAmount(""))}
                                    >
                                        ОК
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* История платежей */}
                <div className="rounded-xl border px-5 py-7 h-full">
                    <HistoryPayments userId={id} />
                </div>
            </div>

            {/* Календарь мастера */}
            <div className="pt-5">
                <div className="rounded-xl border p-6">
                    <h3 className="text-lg font-semibold mb-4">📅 График загруженности мастера</h3>
                    <MasterCalendar 
                        masterId={parseInt(id)} 
                        userRole="operator" 
                        readOnly={true}
                        showCreateButton={false}
                    />
                </div>
            </div>

            {/* Таблица заказов мастера */}
            <div className="pt-5">
                {loadingOrders ? (
                    <div>Загрузка заказов...</div>
                ) : (
                    <OrdersDataTable masterId={id} data={orders} columns={columns} status="operator" />
                )}
            </div>
        </div>
    );
};

export default MasterProfile;
