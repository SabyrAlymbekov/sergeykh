import { Home, ClipboardList, ClipboardCheck, PhoneCall, DollarSign } from 'lucide-react';

export const sidebar_items = [
    {
        title: "Главная",
        url: "#",
        icon: Home,
    },
    {
        title: "Мои заказы",
        url: "/orders",
        icon: ClipboardList,
    },
    {
        title: "Доступные заказы",
        url: "/free-orders",
        icon: ClipboardCheck,
    },
    {
        title: "История звонков",
        url: "/calls",
        icon: PhoneCall,
    },
    {
        title: "Финансы",
        url: "/finance",
        icon: DollarSign,
    },
];