import React, { useState } from 'react';
import { mastersData } from "@shared/constants/masterMangementConstants";
import { Master } from "@shared/constants/types";
import { OrdersDataTable } from "@shared/orders/(beta-orders)/OrdersTable";
import { columns } from "@shared/constants/orders";
import { ChartMasterProfile } from "@/components/users-management/master-profile/charts/chartMasterProfile";
import { HistoryPayments } from "@/components/finances/chartFinances/historyPayments";
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

const MasterProfile = ({ id }: { id: string }) => {
    const [topUpAmount, setTopUpAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    console.log("URL param id:", JSON.stringify(id));

    // Преобразуем mastersData в массив, если он не массив.
    const mastersArray: Master[] = Array.isArray(mastersData)
        ? mastersData
        : Object.values(mastersData);

    console.log("Masters data:", mastersArray);
    console.log("Masters IDs:", mastersArray.map(master => master.id));

    // Находим мастера по id с учетом trim() для устранения лишних пробелов.
    const master = mastersArray.find((master: Master) =>
        master.id.toString().trim() === id.trim()
    );
    console.log("Found master:", master);

    if (!master) {
        return <div>Мастер не найден</div>;
    }

    const balance = 1000;
    const currency = '₸';

    return (
        <div className="flex flex-col mt-5 gap-5">
            <h1 className="text-xl text-center md:text-2xl mb-5 font-bold">
                Профиль мастера {master.name}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3  gap-16">
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl text-gray-400">Баланс</h1>
                        <span className="text-5xl font-bold">
              {balance} {currency}
            </span>
                    </div>
                    <div className="flex gap-5">
                        {/* Диалог для пополнения */}
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
                                    placeholder="На сколько пополнить"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    className="w-full my-4"
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button
                                        onClick={() => {
                                            console.log("Пополнить на:", topUpAmount);
                                            // Добавьте здесь логику пополнения баланса
                                        }}
                                    >
                                        Пополнить
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Диалог для снятия */}
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
                                    placeholder="На сколько снять"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full my-4"
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button
                                        onClick={() => {
                                            console.log("Снять на:", withdrawAmount);
                                            // Добавьте здесь логику снятия средств
                                        }}
                                    >
                                        Снять
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="rounded-xl border px-5 flex-col justify-center items-center py-7">
                    <HistoryPayments />
                </div>
                <ChartMasterProfile />
            </div>

            <OrdersDataTable data={master.orders} columns={columns} status="curator" />
        </div>
    );
};

export default MasterProfile;
