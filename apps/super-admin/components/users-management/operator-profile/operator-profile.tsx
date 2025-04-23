"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@shared/constants/constants";
import { Master as Operator } from "@shared/constants/types";
import { ChartBalanceProfile } from "@/components/users-management/charts/chartBalanceProfile";
import { HistoryPayments } from "@shared/finances/chartFinances/historyPayments";
import CallsDataTable from "@/components/users-management/callsDataTable";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@workspace/ui/components/dialog";

interface OperatorProfileProps {
    id: string;
}

const OperatorProfile: React.FC<OperatorProfileProps> = ({ id }) => {
    const [operator, setOperator] = useState<Operator | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [topUpAmount, setTopUpAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Fetch operator profile
    const fetchProfile = async () => {
        setLoadingProfile(true);
        setError(null);
        try {
            const res = await axios.get<Operator>(`${API}/users/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setOperator(res.data);
        } catch (err) {
            console.error("Ошибка загрузки профиля оператора", err);
            setError("Не удалось загрузить профиль оператора");
        } finally {
            setLoadingProfile(false);
        }
    };

    // Fetch balance
    const fetchBalance = async () => {
        setLoadingBalance(true);
        try {
            const res = await axios.get<{ balance: number }>(`${API}/balance/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setBalance(res.data.balance);
        } catch (err) {
            console.error("Ошибка загрузки баланса оператора", err);
        } finally {
            setLoadingBalance(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchBalance();
    }, [id]);

    const handleTopUp = async () => {
        if (!topUpAmount) return;
        try {
            await axios.post(
                `${API}/balance/${id}/top-up/`,
                { amount: topUpAmount },
                { headers: { Authorization: `Token ${token}` } }
            );
            setTopUpAmount("");
            fetchBalance();
        } catch (err) {
            console.error("Ошибка пополнения баланса", err);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount) return;
        try {
            await axios.post(
                `${API}/balance/${id}/deduct/`,
                { amount: withdrawAmount },
                { headers: { Authorization: `Token ${token}` } }
            );
            setWithdrawAmount("");
            fetchBalance();
        } catch (err) {
            console.error("Ошибка снятия средств", err);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`${API}/users/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setOperator(null);
            setDeleteDialogOpen(false);
        } catch (err) {
            console.error("Ошибка удаления аккаунта оператора", err);
        }
    };

    if (loadingProfile) return <div>Загрузка профиля...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!operator) return <div>Оператор не найден</div>;

    return (
        <div className="flex flex-col mt-5 gap-5">
            <h1 className="text-xl text-center md:text-2xl font-bold">
                Профиль оператора {operator.name}
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-16 items-start">
                {/* Баланс и операции */}
                <div className="flex flex-col items-center gap-5">
                    <h2 className="text-2xl text-gray-400">Баланс</h2>
                    {loadingBalance ? (
                        <span>Загрузка…</span>
                    ) : (
                        <span className="text-5xl font-bold">{balance} ₸</span>
                    )}
                    <div className="flex gap-5">
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
                                    onChange={e => setTopUpAmount(e.target.value)}
                                    className="w-full my-4"
                                />
                                <DialogFooter className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button onClick={handleTopUp}>ОК</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                                    onChange={e => setWithdrawAmount(e.target.value)}
                                    className="w-full my-4"
                                />
                                <DialogFooter className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button onClick={handleWithdraw}>ОК</Button>
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
                <ChartBalanceProfile />
            </div>
            {/* История звонков */}
            {/*<CallsDataTable called={operator.called as CallLog[]} />*/}
            {/* Удаление аккаунта */}
            <div className="flex justify-center mt-10">
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                    Удалить аккаунт
                </Button>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Удалить аккаунт?</DialogTitle>
                    </DialogHeader>
                    <p>Это действие необратимо.</p>
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

export default OperatorProfile;