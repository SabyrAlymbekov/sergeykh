import React, { useState } from 'react';
import { curatorsData } from "@shared/constants/masterMangementConstants";
import { Curator } from "@shared/constants/types";
import { OrdersDataTable } from "@shared/orders/(beta-orders)/OrdersTable";
import { columns } from "@shared/constants/orders";
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
import MastersTable from "@/components/users-management/mastersTable";

const CuratorProfile = ({ id }: { id: string }) => {
    const [topUpAmount, setTopUpAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Find curator by id (using trim() to remove extra spaces)
    const curator = curatorsData.find(c => c.id.toString().trim() === id.trim());
    if (!curator) {
        return <div>Куратор не найден</div>;
    }
    // Save curator data in state for editing.
    const [curatorInfo, setCuratorInfo] = useState(curator);
    const [editedName, setEditedName] = useState(curatorInfo.name);

    const handleSave = () => {
        // Here you can add the logic to update data on the server.
        setCuratorInfo({ ...curatorInfo, name: editedName });
        setIsEditing(false);
        console.log("Новая информация куратора:", { ...curatorInfo, name: editedName });
    };

    const handleCancel = () => {
        // Cancel editing and revert to the original value.
        setEditedName(curatorInfo.name);
        setIsEditing(false);
    };

    const handleDeleteAccount = () => {
        // Here, add your deletion logic (e.g., API call) and then close the dialog.
        console.log("Аккаунт куратора будет удален");
        setDeleteDialogOpen(false);
    };

    const balance = curatorInfo.balance;
    const currency = '₸';

    return (
        <div className="flex flex-col mt-5 gap-5">
            <h1 className="text-xl text-center md:text-2xl mb-5 font-bold">
                Профиль куратора {curatorInfo.name}
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
                        {/* Top Up Dialog */}
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
                                            // Add your top up logic here.
                                        }}
                                    >
                                        Пополнить
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Withdraw Dialog */}
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
                                            // Add your withdraw logic here.
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

                {/* Profile Editing Panel */}
                <div className="rounded-xl flex border px-5 flex-col justify-center items-center py-7">
                    {isEditing ? (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-bold">Редактирование профиля</h2>
                            <Input
                                type="text"
                                placeholder="Имя куратора"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="w-full"
                            />
                            <div className="flex gap-4">
                                <Button onClick={handleSave}>Сохранить</Button>
                                <Button variant="outline" onClick={handleCancel}>Отмена</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 items-center">
                            <h2 className="text-lg font-bold">Мои данные</h2>
                            <p>
                                <strong>Имя:</strong> {curatorInfo.name}
                            </p>
                            {/* Add additional fields if needed */}
                            <Button onClick={() => setIsEditing(true)}>Редактировать профиль</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Display list of master's associated with the curator */}
            <MastersTable mastersData={curatorInfo.masters} />

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
                    <p>Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.</p>
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

export default CuratorProfile;
