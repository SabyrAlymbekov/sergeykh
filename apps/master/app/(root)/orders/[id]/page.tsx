
// app/(root)/orders/[id]/page.tsx
import { use } from "react";
import OrderDetails from "@/components/orders/order-page/orderId";
import { Order } from "@/constants/types";
import { ActionsMenu } from "@/constants/actionMenu";



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




export async function generateStaticParams() {
  return ordersData.map((order) => ({ id: order.id }));
}




// export default function CategoryDetail({params}: {params: Promise<{ id: string }>}) {

export default function Page({params}: {params: Promise<{ id: string }>}) {

  const { id } = use(params);



  return (
    <div>
      <OrderDetails id={id} />
    </div>
  );
}