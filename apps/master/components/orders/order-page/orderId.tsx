import { notFound } from "next/navigation";
import * as React from "react";
import {Order} from "@/constants/types";
import {ActionsMenu} from "@/constants/actionMenu";


const ordersData: Order[] = [
  {
    id: "1",
    contact: "+996 557 819 199",
    orderNumber: "3XP/3999",
    date: "2025-03-07 14:30",
    client: "Иванов И.И.",
    address: "ул. Абая, 10",
    problem: "Протечка крана",
    cost: "5000 ₸",
    executionTime: "2025-03-08 09:00",
    master: "Иванов Мастер",
    status: "В работе",
    actions: <ActionsMenu />,
  },
  {
    id: "2",
    contact: "+996 555 123 456",
    orderNumber: "4XT/4000",
    date: "2025-03-08 10:15",
    client: "Петров П.П.",
    address: "ул. Назарбаева, 25",
    problem: "Не работает розетка",
    cost: "3500 ₸",
    executionTime: "2025-03-08 16:00",
    master: "Сидоров Мастер",
    status: "В работе",
    actions: <ActionsMenu />,
  },
  {
    id: "3",
    contact: "+996 700 987 654",
    orderNumber: "5YT/4001",
    date: "2025-03-09 12:45",
    client: "Семенова А.А.",
    address: "ул. Манаса, 5",
    problem: "Засор в канализации",
    cost: "7500 ₸",
    executionTime: "2025-03-09 18:30",
    master: "Кузнецов Мастер",
    status: "Ожидание",
    actions: <ActionsMenu />,
  },
  {
    id: "4",
    contact: "+996 777 654 321",
    orderNumber: "6ZR/4002",
    date: "2025-03-10 09:20",
    client: "Ковалёв В.В.",
    address: "пр. Тыныстанова, 15",
    problem: "Замена проводки",
    cost: "12000 ₸",
    executionTime: "2025-03-11 14:00",
    master: "Борисов Мастер",
    status: "Завершено",
    actions: <ActionsMenu />,
  },
];

// 🔹 Функция генерации статических путей
const maskPhoneNumber = (phone: string) => {
  const parts = phone.split(' ');
  return `${parts[0]} ${parts[1]?.replace(/./g, '*')} ${parts[2]?.replace(/./g, '*')} ${parts[3]?.slice(-2)}`;
};

// 🔹 Страница деталей заказа
export default function OrderDetails({ id }: { id: string }) {
  const order = ordersData.find((order) => order.id === id);

  if (!order) return notFound();

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
      <div className="mt-4">{order.actions}</div>
    </div>
  );
}