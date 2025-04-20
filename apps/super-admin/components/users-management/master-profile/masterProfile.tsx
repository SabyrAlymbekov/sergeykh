import React, { useState } from 'react';
import { mastersData } from "@shared/constants/masterMangementConstants";
import { Master } from "@shared/constants/types";
import { OrdersDataTable } from "@shared/orders/(beta-orders)/OrdersTable";
import { columns } from "@shared/constants/orders";
// import { ChartMasterProfile } from "@/components/users-management/master-profile/charts/chartBalanceProfile";
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    console.log("URL param id:", JSON.stringify(id));

    // Convert mastersData to an array if necessary
    const mastersArray: Master[] = Array.isArray(mastersData)
        ? mastersData
        : Object.values(mastersData);

    console.log("Masters data:", mastersArray);
    console.log("Masters IDs:", mastersArray.map(master => master.id));

    // Find master by id (trimming extra spaces)
    const master = mastersArray.find((master: Master) =>
        master.id.toString().trim() === id.trim()
    );
    console.log("Found master:", master);

    if (!master) {
        return <div>Мастер не найден</div>;
    }

    const balance = 1000;
    const currency = '₸';

    const handleDeleteAccount = () => {
        console.log("Аккаунт мастера будет удален");
        setDeleteDialogOpen(false);
        // Add your deletion logic here
    };

    return (
        <div className="flex flex-col mt-5 gap-5">
            <h1 className="text-xl text-center md:text-2xl mb-5 font-bold">
                Профиль мастера {master.name}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-16">
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl text-gray-400">Баланс</h1>
                        <span className="text-5xl font-bold">
                            {balance} {currency}
                        </span>
                    </div>
                    <div className="flex gap-5">
                        {/* Dialog for topping up */}
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
                                            // Add your top-up logic here
                                        }}
                                    >
                                        Пополнить
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Dialog for withdrawing */}
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
                                            // Add your withdraw logic here
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
                {/*<ChartMasterProfile />*/}
            </div>

            {/*<OrdersDataTable data={master.orders} columns={columns} status="curator" />*/}

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-center mt-10">
                        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                            Удалить аккаунт
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Подтвердите удаление аккаунта</DialogTitle>
                    </DialogHeader>
                    <p>Вы уверены, что хотите удалить аккаунт мастера? Это действие необратимо.</p>
                    <DialogFooter>
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
