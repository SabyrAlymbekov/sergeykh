import { notFound } from "next/navigation";
import * as React from "react";

import { ordersData } from "@workspace/ui/components/shared/constants/orders";

// 🔹 Функция маскировки номера телефона
const maskPhoneNumber = (phone: string) => {
    const parts = phone.split(' ');
    return `${parts[0]} ${parts[1]?.replace(/./g, '*')} ${parts[2]?.replace(/./g, '*')} ${parts[3]?.slice(-2)}`;
};

// 🔹 Страница деталей заказа
export default function OrderDetails({ id }: { id: string }) {
    const order = ordersData.find((order) => order.id === id);

    if (!order) return notFound();

    // Получаем компонент из order.actions и инстанцируем его
    const ActionsComponent = order.actions;

    return (
        <div className="max-w-2xl mx-auto p-6 shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">Заказ #{order.orderNumber}</h1>
            <div className="space-y-2">
                <p><strong>Дата заказа:</strong> {order.date}</p>
                <p><strong>Клиент:</strong> {order.client}</p>
                <p><strong>Контакт:</strong> {maskPhoneNumber(order.contact)}</p>
                <p><strong>Адрес:</strong> {order.address}</p>
                <p><strong>Проблема:</strong> {order.problem}</p>
                <p><strong>Стоимость:</strong> {order.cost}</p>
                <p><strong>Время выполнения:</strong> {order.executionTime}</p>
                <p><strong>Мастер:</strong> {order.master}</p>
                <p><strong>Статус:</strong> {order.status}</p>
            </div>
            <div className="mt-4">
                <ActionsComponent />
            </div>
        </div>
    );
}
