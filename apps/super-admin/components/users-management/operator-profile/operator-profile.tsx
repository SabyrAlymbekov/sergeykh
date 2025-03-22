import React, { useState } from "react";
import { operatorsData } from "@shared/constants/masterMangementConstants";
import { Operator } from "@shared/constants/types";
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
import CallsDataTable from "@/components/users-management/callsDataTable";
import { HistoryPayments } from "@/components/finances/chartFinances/historyPayments";

const OperatorProfile = ({ id }: { id: string }) => {
    const [topUpAmount, setTopUpAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Convert operatorsData to an array of Operator
    const operatorArray: Operator[] = Array.isArray(operatorsData)
        ? operatorsData
        : (Object.values(operatorsData) as Operator[]);

    // Find the operator by id (using trim to remove extra spaces)
    const operator = operatorArray.find(
        (op: Operator) => op.id.toString().trim() === id.trim()
    );

    if (!operator) {
        return <div>Оператор не найден</div>;
    }

    // Save operator data in state for editing
    const [operatorInfo, setOperatorInfo] = useState(operator);
    const [editedName, setEditedName] = useState(operatorInfo.name);

    const handleSave = () => {
        // Add your logic to update operator info on the server here
        setOperatorInfo({ ...operatorInfo, name: editedName });
        setIsEditing(false);
        console.log("Новая информация оператора:", { ...operatorInfo, name: editedName });
    };

    const handleCancel = () => {
        setEditedName(operatorInfo.name);
        setIsEditing(false);
    };

    const handleDeleteAccount = () => {
        // Add your deletion logic here (e.g. API call)
        console.log("Аккаунт оператора будет удален");
        setDeleteDialogOpen(false);
    };

    const balance = operatorInfo.balance;
    const currency = "₸";

    return (
        <div className="flex flex-col mt-5 gap-5">
            <h1 className="text-xl text-center md:text-2xl mb-5 font-bold">
                Профиль оператора {operatorInfo.name}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-16">
                {/* Balance & Funds Dialogs */}
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
                                            // Add your top-up logic here
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

                {/* History Payments */}
                <div className="rounded-xl border px-5 flex-col justify-center items-center py-7">
                    <h2 className="text-lg font-bold mb-4">История платежей</h2>
                    <HistoryPayments />
                </div>

                {/* Profile Editing Panel */}
                <div className="rounded-xl flex border px-5 flex-col justify-center items-center py-7">
                    {isEditing ? (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-bold">Редактирование профиля</h2>
                            <Input
                                type="text"
                                placeholder="Имя оператора"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="w-full"
                            />
                            <div className="flex gap-4">
                                <Button onClick={handleSave}>Сохранить</Button>
                                <Button variant="outline" onClick={handleCancel}>
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 items-center">
                            <h2 className="text-lg font-bold">Мои данные</h2>
                            <p>
                                <strong>Имя:</strong> {operatorInfo.name}
                            </p>
                            {/* Additional fields can be added here */}
                            <Button onClick={() => setIsEditing(true)}>Редактировать профиль</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Calls History Table */}
            <CallsDataTable called={operatorInfo.called} />

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

export default OperatorProfile;
