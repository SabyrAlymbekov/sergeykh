"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@shared/constants/constants";
import { Master,  } from "@shared/constants/types";
import { ChartBalanceProfile } from "@/components/users-management/charts/chartBalanceProfile";
import { HistoryPayments } from "@shared/finances/chartFinances/historyPayments";
import { OrdersDataTable } from "@shared/orders/(beta-orders)/OrdersTable";
import {columns, Order} from "@shared/constants/orders";
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
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
    const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
    const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [topUpAmount, setTopUpAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

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
            const res = await axios.get<Order[]>(
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
        type: "top-up" | "deduct",
        amount: string,
        clear: () => void
    ) => {
        if (!amount) return;
        
        const numAmount = parseFloat(amount);
        
        if (isNaN(numAmount) || numAmount <= 0) {
            alert("Введите корректную сумму");
            return;
        }
        
        if (type === "deduct" && numAmount > balance) {
            alert("Нельзя списать больше, чем есть на балансе");
            return;
        }
        
        try {
            await axios.post(
                `${API}/balance/${id}/${type}/`,
                { amount },
                { headers: { Authorization: `Token ${token}` } }
            );
            clear();
            fetchBalance();
        } catch (err) {
            console.error(
                `Ошибка ${type === "top-up" ? "пополнения" : "списания"}`,
                err
            );
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`${API}/users/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setDeleteDialogOpen(false);
            setMaster(null);
        } catch (err) {
            console.error("Ошибка удаления аккаунта мастера", err);
        }
    };

    // ──────────────── UI ────────────────
    if (loadingProfile) return <div>Загрузка профиля...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!master) return <div>Мастер не найден</div>;

    return (
        <div className="flex flex-col mt-5 gap-5">
            <h1 className="text-xl text-center md:text-2xl mb-5 font-bold">
                Профиль мастера {master.name}
            </h1>

            {/* блок: баланс, лог, график */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Баланс и операции */}
                <div className="flex flex-col items-center gap-5">
                    <h2 className="text-2xl text-gray-400">Баланс</h2>
                    {loadingBalance ? (
                        <span>Загрузка…</span>
                    ) : (
                        <span className="text-5xl font-bold">{balance} ₸</span>
                    )}
                    <div className="flex gap-5">
                        {/* Пополнить */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-[100px]">
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

                        {/* Снять */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-[100px]">
                                    Снять
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Снять средства</DialogTitle>
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

                {/* График баланса */}
                {/*<ChartBalanceProfile />*/}
            </div>

            {/* Календарь мастера */}
            <div className="pt-5">
                <div className="rounded-xl border p-6">
                    <h3 className="text-lg font-semibold mb-4">📅 График загруженности мастера</h3>
                    <MasterCalendar 
                        masterId={parseInt(id)} 
                        userRole="admin" 
                        readOnly={true}
                        showCreateButton={false}
                        apiBaseUrl={API}
                    />
                </div>
            </div>

            {/* Таблица заказов мастера */}
            <div className="pt-5">{loadingOrders ? (
                    <div>Загрузка заказов...</div>
                ) : (
                    <OrdersDataTable masterId={id} data={orders} columns={columns} status="curator" />
                )}
            </div>

            {/* Удаление аккаунта */}
            <div className="flex justify-center mt-10">
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                    Удалить аккаунт
                </Button>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Удалить?</DialogTitle>
                    </DialogHeader>
                    <p>Это действие необратимо</p>
                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Отмена</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Удалить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MasterProfile;
