"use client"

import React, { useState } from "react";


import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

const DistancePage = () => {
    // Состояния для обычной дистанционки:
    const [averageCheckThreshold, setAverageCheckThreshold] = useState(65000);
    const [visiblePeriodStandard, setVisiblePeriodStandard] = useState(28); // часы

    // Состояния для суточной дистанционки:
    const [dailyOrderSumThreshold, setDailyOrderSumThreshold] = useState(350000);
    const [netTurnoverThreshold, setNetTurnoverThreshold] = useState(1500000);
    const [visiblePeriodDaily, setVisiblePeriodDaily] = useState(24); // часы

    const handleSave = () => {
        // Здесь можно добавить логику сохранения (например, API вызов)
        console.log("Новые настройки дистанционки:", {
            averageCheckThreshold,
            visiblePeriodStandard,
            dailyOrderSumThreshold,
            netTurnoverThreshold,
            visiblePeriodDaily,
        });
    };

    return (
        <div className="md:max-w-3xl md:mx-auto md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Настройки дистанционки
            </h1>

            {/* Обычная дистанционка */}
            <div className="mb-8 border p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Обычная дистанционка</h2>
                <p className="mb-4 text-gray-600">
                    Если средний чек за последние 10 заказов ≥ {averageCheckThreshold}₸, мастер видит заказы на {visiblePeriodStandard} часов вперед.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Средний чек (₸)
                        </label>
                        <Input
                            type="number"
                            value={averageCheckThreshold}
                            onChange={(e) => setAverageCheckThreshold(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Заказы видны (часов)
                        </label>
                        <Input
                            type="number"
                            value={visiblePeriodStandard}
                            onChange={(e) => setVisiblePeriodStandard(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Суточная дистанционка */}
            <div className="mb-8 border p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Суточная дистанционка</h2>
                <p className="mb-4 text-gray-600">
                    Для суточной дистанционки требуется, чтобы сумма заказов за сутки была ≥ {dailyOrderSumThreshold}₸ или чистый вал за 10 дней ≥ {netTurnoverThreshold}₸. В таком случае заказы видны на {visiblePeriodDaily} часов вперед.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Сумма заказов в сутки (₸)
                        </label>
                        <Input
                            type="number"
                            value={dailyOrderSumThreshold}
                            onChange={(e) => setDailyOrderSumThreshold(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Чистый вал за 10 дней (₸)
                        </label>
                        <Input
                            type="number"
                            value={netTurnoverThreshold}
                            onChange={(e) => setNetTurnoverThreshold(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Заказы видны (часов)
                        </label>
                        <Input
                            type="number"
                            value={visiblePeriodDaily}
                            onChange={(e) => setVisiblePeriodDaily(Number(e.target.value))}
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

export default DistancePage;
