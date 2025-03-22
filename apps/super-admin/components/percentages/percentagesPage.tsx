"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

const PercentagesPage = () => {
    // Section 1: Calculation of clean profit distribution
    const [masterAdvance, setMasterAdvance] = useState(30); // Аванс мастеру (%)
    const [masterCashDesk, setMasterCashDesk] = useState(70); // Сумма, которую мастер сдает в кассу (%)

    // Section 2: Distribution of money by the curator
    const [immediateCash, setImmediateCash] = useState(30); // Наличные мастеру сразу (%)
    const [creditedBalance, setCreditedBalance] = useState(30); // Зачисление на баланс мастеру (%)
    const [curatorPercent, setCuratorPercent] = useState(5); // Процент куратору (%)
    const [companyDesk, setCompanyDesk] = useState(35); // Процент, остающийся в кассе компании (%)

    const handleSave = () => {
        // Replace this with your saving logic (e.g. API call)
        console.log("Новые процентные ставки:", {
            masterAdvance,
            masterCashDesk,
            immediateCash,
            creditedBalance,
            curatorPercent,
            companyDesk,
        });
    };

    return (
        <div className="md:max-w-3xl md:mx-auto md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Настройки процентных ставок
            </h1>

            {/* Section 1: Clean Profit Calculation */}
            <div className="mb-8 border p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Расчёт чистой прибыли</h2>
                <p className="mb-4 text-gray-600">
                    Чистая прибыль = сумма заказа - расходы мастера.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Аванс мастеру (%)
                        </label>
                        <Input
                            type="number"
                            value={masterAdvance}
                            onChange={(e) => setMasterAdvance(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Сдача в кассу (%)
                        </label>
                        <Input
                            type="number"
                            value={masterCashDesk}
                            onChange={(e) => setMasterCashDesk(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Distribution of Funds */}
            <div className="mb-8 border p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">
                    Распределение финансов куратором
                </h2>
                <p className="mb-4 text-gray-600">
                    Мастер передает деньги куратору, который распределяет их следующим
                    образом:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Наличные мастеру сразу (%)
                        </label>
                        <Input
                            type="number"
                            value={immediateCash}
                            onChange={(e) => setImmediateCash(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Зачисление на баланс мастеру (%)
                        </label>
                        <Input
                            type="number"
                            value={creditedBalance}
                            onChange={(e) => setCreditedBalance(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Куратору (%)
                        </label>
                        <Input
                            type="number"
                            value={curatorPercent}
                            onChange={(e) => setCuratorPercent(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Касса компании (%)
                        </label>
                        <Input
                            type="number"
                            value={companyDesk}
                            onChange={(e) => setCompanyDesk(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button onClick={handleSave}>Сохранить изменения</Button>
            </div>
        </div>
    );
};

export default PercentagesPage;
