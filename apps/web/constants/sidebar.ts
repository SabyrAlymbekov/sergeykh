import { Home, ClipboardList, ClipboardCheck, PhoneCall, ChartColumn, UserRound, CalendarCheck, Settings, ChartNoAxesCombined } from 'lucide-react';

export const sidebar_items = [
    {
        name: "Инструменты",
        list: [
            {
                title: "Главная",
                url: "/",
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
                icon: ChartColumn,
            },
        ]
    }, {
        name: "Информация",
        list: [
            {
                title: "График работы",
                url: "/schedule",
                icon: CalendarCheck
            }, {
                title: "Профиль",
                url: "/profile",
                icon: UserRound
            }, {
                title: "Рейтинг",
                url: "/leaderboard",
                icon: ChartNoAxesCombined
            }, {
                title: "Настройки",
                url: "/settings",
                icon: Settings
            }
        ]
    }
]